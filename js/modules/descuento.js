
import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";


export class descuento extends connect {
    static instanceDescuento;
    db;
    collection;

    constructor() {
        if (descuento.instanceDescuento) {
            return descuento.instanceDescuento;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('boleto');
        descuento.instanceDescuento = this;
    }
    destructor() {
        descuento.instanceDescuento = undefined;
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
    async descuentoBoleto(nuevoBoleto) {
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
}