import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";


// 2. Compra de boletos

export class boleto extends connect {
    static instanceBoleto;
    db;
    collection;

    constructor() {
        if (boleto.instanceBoleto) {
            return boleto.instanceBoleto;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('boleto');
        boleto.instanceBoleto = this;
    }
    destructor() {
        boleto.instanceBoleto = undefined;
        connect.instanceConnect = undefined;
    }

        
        /**
     * Este método crea un nuevo boleto para una película en un cine. Realiza validaciones,
     * calcula el precio del boleto según el tipo de usuario y el estado de la película, y
     * inserta el boleto en la base de datos.
     *
     * @param {Object} nuevoBoleto - Objeto que representa el boleto a crear. Debe contener las siguientes propiedades:
     * @param {string} nuevoBoleto.id - Identificador único del boleto.
     * @param {string} nuevoBoleto.id_pelicula - Identificador único de la película.
     * @param {string} nuevoBoleto.id_horario_funcion - Identificador único del horario de la función.
     * @param {string} nuevoBoleto.id_usuario - Identificador único del usuario.
     * @param {string} nuevoBoleto.id_reserva - Identificador único de la reserva (opcional, puede ser null).
     * @param {string} nuevoBoleto.asiento - Número de asiento.
     * @param {string} nuevoBoleto.tipo_compra - Tipo de compra (por ejemplo, "online", "offline").
     * @param {string} nuevoBoleto.metodo_pago - Método de pago (por ejemplo, "tarjeta de crédito", "efectivo").
     * @param {string} nuevoBoleto.estado_compra - Estado de la compra (por ejemplo, "pendiente", "pagado").
     *
     * @returns {Promise<Object|Error>} - Promesa que se resuelve con el objeto del boleto creado si la operación es exitosa,
     * o se rechaza con un mensaje de error si alguna validación falla.
     */
    async crearBoleto1(nuevoBoleto) {
        await this.conexion.connect();

        const peliculaColeccion = this.db.collection('pelicula');
        const pelicula = await peliculaColeccion.findOne({ id: nuevoBoleto.id_pelicula });

        if (!pelicula) {
            await this.conexion.close();
            return { mensaje: "Película no existente dentro de la base de datos." };
        }

        const usuarioColeccion = this.db.collection('usuario');
        const usuario = await usuarioColeccion.findOne({ id: nuevoBoleto.id_usuario });

        if (!usuario) {
            await this.conexion.close();
            return { mensaje: "Usuario no existente dentro de la base de datos." };
        }

        if (nuevoBoleto.id_reserva !== null) {
            const reservaColeccion = this.db.collection('reserva');
            const reserva = await reservaColeccion.findOne({ id: nuevoBoleto.id_reserva });
            if (!reserva) {
                await this.conexion.close();
                return { mensaje: "La reserva especificada no existe." };
            }
        }

        const boletoExistentePorId = await this.collection.findOne({ id: nuevoBoleto.id });

        if (boletoExistentePorId) {
            await this.conexion.close();
            return { mensaje: "Ya existe un boleto con el mismo ID." };
        }

        const boletoExistente = await this.collection.findOne({
            id_pelicula: nuevoBoleto.id_pelicula,
            id_horario_funcion: nuevoBoleto.id_horario_funcion,
            id_usuario: nuevoBoleto.id_usuario,
            id_reserva: nuevoBoleto.id_reserva,
            asiento: nuevoBoleto.asiento,
            tipo_compra: nuevoBoleto.tipo_compra,
            metodo_pago: nuevoBoleto.metodo_pago,
            estado_compra: nuevoBoleto.estado_compra
        });

        if (boletoExistente) {
            await this.conexion.close();
            return { mensaje: "Ya existe un boleto con los mismos datos." };
        }

        if (pelicula.estado !== 'En cartelera') {
            await this.conexion.close();
            return { mensaje: "Película no disponible. No se encuentra en cartelera." };
        }

        const horarioColeccion = this.db.collection('horario_funcion');
        const horario = await horarioColeccion.findOne({ id: nuevoBoleto.id_horario_funcion });

        if (!horario) {
            await this.conexion.close();
            return { mensaje: "Horario de función no encontrado." };
        }

        if (horario.id_pelicula !== nuevoBoleto.id_pelicula) {
            await this.conexion.close();
            return { mensaje: "La película no tiene ese horario asignado." };
        }

        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
        const anio = fechaActual.getFullYear();
        nuevoBoleto.fecha_compra = `${anio}-${mes}-${dia}`;

        nuevoBoleto.fecha_funcion = horario.fecha_funcion;
        nuevoBoleto.hora_funcion = horario.hora_funcion;

        if (usuario.rol === 'VIP') {
            const tarjetaColeccion = this.db.collection('tarjeta_vip');
            const tarjeta = await tarjetaColeccion.findOne({ id_usuario: nuevoBoleto.id_usuario, estado: 'activa' });

            if (tarjeta && new Date(tarjeta.fecha_expiracion) > new Date()) {
                const descuento = tarjeta.descuento / 100;
                nuevoBoleto.total = Math.round(horario.precio * (1 - descuento));
            } else {
                nuevoBoleto.total = horario.precio;
            }
        } else {
            nuevoBoleto.total = horario.precio;
        }

        nuevoBoleto.total = Math.round(nuevoBoleto.total);

        await this.collection.insertOne(nuevoBoleto);

        await this.conexion.close();
        return nuevoBoleto;
    }
    
    


        /**
     * Obtiene una lista de asientos disponibles en una sala de cine para un horario de función específico.
     * 
     * @param {number} idHorarioFuncion - El identificador único del horario de función para el cual se buscan los asientos disponibles.
     * 
     * @returns {Promesa<Array>} Una promesa que se resuelve en un array de objetos de asiento disponibles. Cada objeto de asiento contiene las siguientes propiedades:
     * - id: El identificador único del asiento.
     * - estado: El estado del asiento (por ejemplo, "disponible").
     * 
     * Si el horario de función no se encuentra en la base de datos, o si la sala asociada no se encuentra, o si ocurre un error en la conexión a la base de datos, la promesa se resuelve con un array que contiene un único mensaje:
     * - "Horario de función no encontrado" o "Sala no encontrada", dependiendo del error específico.
     * 
     * En caso de que se produzca un error durante la ejecución, el método también imprimirá un mensaje de error en la consola.
     */
    async buscarAsientosDisponibles(idHorarioFuncion) {
        try {
            await this.conexion.connect();
    
            const horarioColeccion = this.db.collection('horario_funcion');
            const horario = await horarioColeccion.findOne({ id: idHorarioFuncion });
    
            if (!horario) {
                throw new Error("Horario de función no encontrado");
            }
    
            const salaColeccion = this.db.collection('sala');
            const sala = await salaColeccion.findOne({ id: horario.id_sala });
    
            if (!sala) {
                throw new Error("Sala no encontrada.");
            }
    
            const asientosDisponibles = sala.asientos;
            const asientosColeccion = this.db.collection('asiento');
            const asientos = await asientosColeccion.find({
                id: { $in: asientosDisponibles },
                estado: "disponible"
            }).toArray();
    
            await this.conexion.close();
            return asientos; 
    
        } catch (error) {
            console.log(`{${error.message}}`);
            await this.conexion.close();
            return [`Horario de funcion erroneo`];
        }
    }            
}