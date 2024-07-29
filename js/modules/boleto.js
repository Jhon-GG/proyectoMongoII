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

    async crearBoleto(nuevoBoleto) {
        await this.conexion.connect();

        // Verificar si ya existe un boleto con el mismo id
        const boletoExistentePorId = await this.collection.findOne({ id: nuevoBoleto.id });

        if (boletoExistentePorId) {
            await this.conexion.close();
            throw new Error("Ya existe un boleto con el mismo ID.");
        }

        // Verificar si ya existe un boleto con los mismos datos 
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

        // Obtener detalles de la función
        const horarioColeccion = this.db.collection('horario_funcion');
        const horario = await horarioColeccion.findOne({ id: nuevoBoleto.id_horario_funcion });

        if (!horario) {
            await this.conexion.close();
            throw new Error("Horario de función no encontrado.");
        }

        // Añadir fecha y hora de la función al boleto
        nuevoBoleto.fecha_funcion = horario.fecha_funcion;
        nuevoBoleto.hora_funcion = horario.hora_funcion;

        // Verificar tipo de usuario
        const usuarioColeccion = this.db.collection('tarjeta_vip');
        const usuarioVIP = await usuarioColeccion.findOne({ id_usuario: nuevoBoleto.id_usuario });

        if (usuarioVIP && usuarioVIP.estado === 'activa') {
            const descuento = usuarioVIP.descuento / 100;
            nuevoBoleto.total = horario.precio * (1 - descuento);
        } else {
            nuevoBoleto.total = horario.precio;
        }

        // Insertar el boleto en la colección
        await this.collection.insertOne(nuevoBoleto);

        await this.conexion.close();
        return nuevoBoleto;
    }

}