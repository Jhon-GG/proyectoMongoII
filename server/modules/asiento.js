
const { connect } = require ("../../server/db/connect.js")
const { ObjectId } = require ("mongodb")


// 3. Asignación de asientos

module.exports = class asiento extends connect {
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
                    throw new Error(`Las fechas deben seguir el formato YYYY-MM-DD`);
                }
        
                const reservaExistentePorId = await this.collection.findOne({ id: nuevaReserva.id });
        
                if (reservaExistentePorId) {
                    throw new Error(`Ya existe una reserva con el mismo ID`);
                }
        
                const peliculaColeccion = this.db.collection('pelicula');
                const pelicula = await peliculaColeccion.findOne({ 
                    id: nuevaReserva.id_pelicula, 
                    estado: { $in: ["En cartelera", "Próximo estreno"] } 
                });
        
                if (!pelicula) {
                    throw new Error(`Película no disponible o no se encuentra en cartelera`);
                }
        
                const horarioColeccion = this.db.collection('horario_funcion');
                const horario = await horarioColeccion.findOne({ 
                    id: nuevaReserva.id_horario_funcion,
                    id_pelicula: nuevaReserva.id_pelicula
                });
        
                if (!horario) {
                    throw new Error(`Horario de función no encontrado o no es válido para esta película`);
                }
        
                nuevaReserva.fecha_funcion = horario.fecha_funcion;
                nuevaReserva.hora_funcion = horario.hora_funcion;
        
                const usuarioColeccion = this.db.collection('usuario');
                const usuario = await usuarioColeccion.findOne({ id: nuevaReserva.id_usuario });
        
                if (!usuario) {
                    throw new Error(`Usuario no encontrado`);
                }
        
                const sala = await this.db.collection('sala').findOne({ id: horario.id_sala });
                if (!sala) {
                    throw new Error('No se encontró la sala asociada a este horario de proyección.');
                }
        
                const asientosValidos = nuevaReserva.asientos.every(asientoId => sala.asientos.includes(asientoId));
                if (!asientosValidos) {
                    throw new Error('Uno o más asientos seleccionados no pertenecen a la sala de esta proyección.');
                }
        
                const asientosDisponibles = await this.db.collection('asiento').countDocuments({ 
                    id: { $in: nuevaReserva.asientos }, 
                    estado: 'disponible' 
                });
                if (asientosDisponibles !== nuevaReserva.asientos.length) {
                    throw new Error('Uno o más asientos seleccionados no están disponibles.');
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
        
                nuevaReserva.fecha_reserva = nuevaReserva.fecha_reserva || this.getFechaActual();
                nuevaReserva.estado = nuevaReserva.estado || 'activa';
                nuevaReserva.expiracion = nuevaReserva.expiracion || this.getFechaExpiracion();
        
                await this.collection.insertOne(nuevaReserva);
        
                await this.db.collection('asiento').updateMany(
                    { id: { $in: nuevaReserva.asientos } },
                    { $set: { estado: 'reservado' } }
                );
        
                return {
                    mensaje: 'Reserva realizada con éxito',
                    detallesReserva: nuevaReserva
                };
        
            } catch (error) {
                console.log(`{${error.message}}`);
                return { error: `Error al realizar la reserva: ${error.message}` };
            } finally {
                await this.conexion.close();
            }
        }
        
        getFechaActual() {
            const fecha = new Date();
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
        }
        
        getFechaExpiracion() {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + 3);
            return `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
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
        try {
            await this.conexion.connect();
    
            const reservaExistente = await this.collection.findOne({ id: idReserva });
    
            if (!reservaExistente) {
                throw new Error("Reserva no encontrada");
            }
    
            // Actualiza solo el estado de la reserva a "cancelada"
            const resultado = await this.collection.updateOne(
                { id: idReserva },
                { $set: { estado: 'cancelada' } }
            );
    
            if (resultado.modifiedCount === 0) {
                throw new Error("No se pudo actualizar el estado de la reserva.");
            }
    
            const reservaActualizada = await this.collection.findOne({ id: idReserva });
            return reservaActualizada;
    
        } catch (error) {
            console.log(`{Error ${error.message}}`);
            return [`Ha ocurrido un error durante la reserva`]; 
        } finally {
            await this.conexion.close();
        }
    }
    
}