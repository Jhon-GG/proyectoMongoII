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
     * Este método crea un nuevo boleto (ticket) en la base de datos.
     * Verifica varias condiciones y calcula el precio total según el rol del usuario y el estado de la tarjeta VIP.
     *
     * @param {Object} nuevoBoleto - El objeto de boleto nuevo que se insertará en la base de datos.
     * @param {string} nuevoBoleto.id - El identificador único para el boleto.
     * @param {string} nuevoBoleto.id_pelicula - El ID de la película asociada con el boleto.
     * @param {string} nuevoBoleto.id_horario_funcion - El ID del horario de la función asociado con el boleto.
     * @param {string} nuevoBoleto.id_usuario - El ID del usuario que está comprando el boleto.
     * @param {string} nuevoBoleto.id_reserva - El ID de la reserva asociada con el boleto.
     * @param {number} nuevoBoleto.asiento - El número de asiento para el boleto.
     * @param {string} nuevoBoleto.tipo_compra - El tipo de compra (por ejemplo, "online", "offline").
     * @param {Date} nuevoBoleto.fecha_compra - La fecha de la compra.
     * @param {string} nuevoBoleto.metodo_pago - El método de pago utilizado para la compra.
     * @param {string} nuevoBoleto.estado_compra - El estado de la compra (por ejemplo, "pendiente", "pagado").
     *
     * @returns {Promise<Object>} - Una promesa que se resuelve con el objeto de boleto nuevo.
     * @throws {Error} - Lanza un error si alguna de las condiciones no se cumple o si se produce un error durante las operaciones de base de datos.
     */
    async crearBoleto1(nuevoBoleto) {
        await this.conexion.connect();

        const boletoExistentePorId = await this.collection.findOne({ id: nuevoBoleto.id });

        if (boletoExistentePorId) {
            await this.conexion.close();
            throw new Error("Ya existe un boleto con el mismo ID.");
        }

        const boletoExistente = await this.collection.findOne({
            id_pelicula: nuevoBoleto.id_pelicula,
            id_horario_funcion: nuevoBoleto.id_horario_funcion,
            id_usuario: nuevoBoleto.id_usuario,
            id_reserva: nuevoBoleto.id_reserva,
            asiento: nuevoBoleto.asiento,
            tipo_compra: nuevoBoleto.tipo_compra,
            fecha_compra: nuevoBoleto.fecha_compra,
            metodo_pago: nuevoBoleto.metodo_pago,
            estado_compra: nuevoBoleto.estado_compra
        });

        if (boletoExistente) {
            await this.conexion.close();
            throw new Error("Ya existe un boleto con los mismos datos.");
        }

        const peliculaColeccion = this.db.collection('pelicula');
        const pelicula = await peliculaColeccion.findOne({ id: nuevoBoleto.id_pelicula });

        if (!pelicula || pelicula.estado !== 'En cartelera') {
            await this.conexion.close();
            throw new Error("Película no disponible. No se encuentra en cartelera.");
        }

        const horarioColeccion = this.db.collection('horario_funcion');
        const horario = await horarioColeccion.findOne({ id: nuevoBoleto.id_horario_funcion });

        if (!horario) {
            await this.conexion.close();
            throw new Error("Horario de función no encontrado.");
        }

        nuevoBoleto.fecha_funcion = horario.fecha_funcion;
        nuevoBoleto.hora_funcion = horario.hora_funcion;

        const usuarioColeccion = this.db.collection('usuario');
        const usuario = await usuarioColeccion.findOne({ id: nuevoBoleto.id_usuario });

        if (!usuario) {
            await this.conexion.close();
            throw new Error("Usuario no encontrado.");
        }

        if (usuario.rol === 'VIP') {
            const tarjetaColeccion = this.db.collection('tarjeta_vip');
            const tarjeta = await tarjetaColeccion.findOne({ id_usuario: nuevoBoleto.id_usuario, estado: 'activa' });

            if (tarjeta && new Date(tarjeta.fecha_expiracion) > new Date()) {
                const descuento = tarjeta.descuento / 100;
                nuevoBoleto.total = horario.precio * (1 - descuento);
            } else {
                nuevoBoleto.total = horario.precio;
            }
        } else {
            nuevoBoleto.total = horario.precio;
        }

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