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

    async crearBoleto1(nuevoBoleto) {
        await this.conexion.connect();
    
        // Verificar si la película existe
        const peliculaColeccion = this.db.collection('pelicula');
        const pelicula = await peliculaColeccion.findOne({ id: nuevoBoleto.id_pelicula });
    
        if (!pelicula) {
            await this.conexion.close();
            return { mensaje: "Película no existente dentro de la base de datos." };
        }
    
        // Verificar si el usuario existe
        const usuarioColeccion = this.db.collection('usuario');
        const usuario = await usuarioColeccion.findOne({ id: nuevoBoleto.id_usuario });
    
        if (!usuario) {
            await this.conexion.close();
            return { mensaje: "Usuario no existente dentro de la base de datos." };
        }
    
        // Verificar si la reserva existe si se especifica un id_reserva
        if (nuevoBoleto.id_reserva !== null) {
            const reservaColeccion = this.db.collection('reserva');
            const reserva = await reservaColeccion.findOne({ id: nuevoBoleto.id_reserva });
            if (!reserva) {
                await this.conexion.close();
                return { mensaje: "La reserva especificada no existe." };
            }
        }
    
        // Verificar si el boleto con el mismo ID ya existe
        const boletoExistentePorId = await this.collection.findOne({ id: nuevoBoleto.id });
    
        if (boletoExistentePorId) {
            await this.conexion.close();
            return { mensaje: "Ya existe un boleto con el mismo ID." };
        }
    
        // Verificar si ya existe un boleto con los mismos datos
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
    
        // Verificar si la película está en cartelera
        if (pelicula.estado !== 'En cartelera') {
            await this.conexion.close();
            return { mensaje: "Película no disponible. No se encuentra en cartelera." };
        }
    
        // Verificar si el horario de función existe y está ligado a la película correcta
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
    
        // Establecer la fecha de compra como la fecha actual del sistema en formato YYYY-MM-DD
        const fechaActual = new Date();
        const dia = String(fechaActual.getDate()).padStart(2, '0');
        const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const anio = fechaActual.getFullYear();
        nuevoBoleto.fecha_compra = `${anio}-${mes}-${dia}`;
    
        nuevoBoleto.fecha_funcion = horario.fecha_funcion;
        nuevoBoleto.hora_funcion = horario.hora_funcion;
    
        // Calcular el precio del boleto
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
    
        // Asegurarse de que el total sea un entero
        nuevoBoleto.total = Math.round(nuevoBoleto.total);
    
        await this.collection.insertOne(nuevoBoleto);
    
        await this.conexion.close();
        return nuevoBoleto;
    }
    
    


    
        /**
     * Esta función recupera los asientos disponibles para una función de cine determinada.
     * Se conecta a la base de datos, recupera la función y la información de la sala asociada,
     * y luego recupera los asientos disponibles de la base de datos.
     *
     * @param {string} idHorarioFuncion - El identificador único de la función de cine.
     *
     * @returns {Promise<Array>} - Una promesa que se resuelve con un array de asientos disponibles.
     * Cada objeto de asiento contiene una propiedad 'id' y 'estado'.
     *
     * @throws {Error} - Lanza un error si la función de cine o la sala no se encuentran.
     */
    async buscarAsientosDisponibles(idHorarioFuncion) {
        await this.conexion.connect();

        const horarioColeccion = this.db.collection('horario_funcion');
        const horario = await horarioColeccion.findOne({ id: idHorarioFuncion });

        if (!horario) {
            await this.conexion.close();
            throw new Error("Horario de función no encontrado.");
        }

        const salaColeccion = this.db.collection('sala');
        const sala = await salaColeccion.findOne({ id: horario.id_sala });

        if (!sala) {
            await this.conexion.close();
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
    }
}