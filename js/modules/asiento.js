
import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";


// 3. Asignación de asientos

export class asiento extends connect {
    static instanceAsiento;
    db;
    collection;

    constructor() {
        if (asiento.instanceAsiento) {
            return asiento.instanceAsiento;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('reserva');
        asiento.instanceAsiento = this;
    }
    destructor() {
        asiento.instanceAsiento = undefined;
        connect.instanceConnect = undefined;
    }


        /**
     * Crea una nueva reserva en la base de datos.
     *
     * @param {Object} nuevaReserva - El objeto de reserva que se va a crear.
     * @param {string} nuevaReserva.id - El identificador único de la reserva.
     * @param {string} nuevaReserva.id_pelicula - El ID de la película asociada con la reserva.
     * @param {string} nuevaReserva.id_horario_funcion - El ID del horario de función asociado con la reserva.
     * @param {string} nuevaReserva.id_usuario - El ID del usuario que realiza la reserva.
     * @param {Array} nuevaReserva.asientos - La lista de asientos reservados para el usuario.
     * @param {string} nuevaReserva.fecha_reserva - La fecha en que se realizó la reserva.
     * @param {string} nuevaReserva.estado - El estado actual de la reserva (e.g., 'pendiente', 'confirmada', 'cancelada').
     * @param {string} nuevaReserva.expiracion - La fecha en que la reserva expira.
     *
     * @returns {Promise<Object>} - Una promesa que se resuelve al objeto de reserva creado.
     *
     * @throws {Error} - Si los datos de la reserva son inválidos o si ya existe una reserva con el mismo ID o datos.
     * @throws {Error} - Si la película, el horario de función o el usuario asociados con la reserva no se encuentran o no están disponibles.
     */
        async crearReserva(nuevaReserva) {
            try {
                await this.conexion.connect();
        
                // Validar que las fechas sigan el formato YYYY-MM-DD
                const fechaReservaRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (!fechaReservaRegex.test(nuevaReserva.fecha_reserva) || !fechaReservaRegex.test(nuevaReserva.expiracion)) {
                    throw new Error[`Las fechas deben seguir el formato YYYY-MM-DD`];
                }
        
                const reservaExistentePorId = await this.collection.findOne({ id: nuevaReserva.id });
        
                if (reservaExistentePorId) {
                    throw new Error(`Ya existe una reserva con el mismo ID`);
                }
        
                const reservaExistente = await this.collection.findOne({
                    id_pelicula: nuevaReserva.id_pelicula,
                    id_horario_funcion: nuevaReserva.id_horario_funcion,
                    id_usuario: nuevaReserva.id_usuario,
                    asientos: { $all: nuevaReserva.asientos },
                    fecha_reserva: nuevaReserva.fecha_reserva,
                    estado: nuevaReserva.estado,
                    expiracion: nuevaReserva.expiracion
                });
        
                if (reservaExistente) {
                    throw new Error(`Ya existe una reserva con los mismos datos`);
                }
        
                const peliculaColeccion = this.db.collection('pelicula');
                const pelicula = await peliculaColeccion.findOne({ id: nuevaReserva.id_pelicula });
        
                if (!pelicula || pelicula.estado !== 'En cartelera') {
                    throw new Error(`Película no disponible. No se encuentra en cartelera`);
                }
        
                const horarioColeccion = this.db.collection('horario_funcion');
                const horario = await horarioColeccion.findOne({ id: nuevaReserva.id_horario_funcion });
        
                if (!horario) {
                    throw new Error(`Horario de función no encontrado`);
                }
        
                nuevaReserva.fecha_funcion = horario.fecha_funcion;
                nuevaReserva.hora_funcion = horario.hora_funcion;
        
                const usuarioColeccion = this.db.collection('usuario');
                const usuario = await usuarioColeccion.findOne({ id: nuevaReserva.id_usuario });
        
                if (!usuario) {
                    throw new Error(`Usuario no encontrado`);
                }
        
                if (usuario.rol === 'VIP') {
                    const tarjetaColeccion = this.db.collection('tarjeta_vip');
                    const tarjeta = await tarjetaColeccion.findOne({ id_usuario: nuevaReserva.id_usuario, estado: 'activa' });
        
                    if (tarjeta && new Date(tarjeta.fecha_expiracion) > new Date()) {
                        const descuento = tarjeta.descuento / 100;
                        nuevaReserva.total = horario.precio * (1 - descuento);
                    } else {
                        nuevaReserva.total = horario.precio;
                    }
                } else {
                    nuevaReserva.total = horario.precio;
                }
        
                await this.collection.insertOne(nuevaReserva);
        
                return nuevaReserva;
        
            } catch (error) {
                console.log(`{${error.message}}`);
                return [`Ha ocurrido un error`] ; 
            } finally {
                await this.conexion.close();
            }
        }
        

    /**
 * Cancela una reserva en la base de datos.
 *
 * @param {string} idReserva - El identificador único de la reserva que se va a cancelar.
 *
 * @returns {Promise<Object>} - Una promesa que se resuelve al objeto de reserva actualizado.
 *
 * @throws {Error} - Si la reserva no se encuentra.
 * @throws {Error} - Si el estado de la reserva no se pudo actualizar.
 */
async cancelarReserva(idReserva) {
    await this.conexion.connect();

    const reservaExistente = await this.collection.findOne({ id: idReserva });

    if (!reservaExistente) {
        await this.conexion.close();
        throw new Error("Reserva no encontrada.");
    }

    // Actualiza solo el estado de la reserva a "cancelada"
    const resultado = await this.collection.updateOne(
        { id: idReserva },
        { $set: { estado: 'cancelada' } }
    );

    if (resultado.modifiedCount === 0) {
        await this.conexion.close();
        throw new Error("No se pudo actualizar el estado de la reserva.");
    }

    const reservaActualizada = await this.collection.findOne({ id: idReserva });
    await this.conexion.close();
    return reservaActualizada;
}
}