import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";

// 5. Roles definidos


export class rol extends connect {
    static instanceRol;
    db;
    collection;

    constructor() {
        if (rol.instanceRol) {
            return rol.instanceRol;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('usuario');
        rol.instanceRol = this;
    }

    destructor() {
        rol.instanceRol = undefined;
        connect.instanceConnect = undefined;
    }

    
        /**
     * Añade un nuevo usuario a la base de datos.
     *
     * @param {Object} nuevoUsuario - El objeto de usuario a añadir.
     * @param {string} nuevoUsuario.id - El identificador único del usuario.
     * @param {string} nuevoUsuario.nombre - El nombre del usuario.
     * @param {string} nuevoUsuario.apellido - El apellido del usuario.
     * @param {string} nuevoUsuario.email - La dirección de correo electrónico del usuario.
     * @param {string} nuevoUsuario.password - La contraseña del usuario.
     * @param {string} nuevoUsuario.rol - El rol del usuario.
     *
     * @returns {Object|Promise} - Si se realiza correctamente, devuelve el objeto de usuario añadido.
     * Si se produce un error, devuelve un objeto con un mensaje de error.
     *
     * @throws {Error} - Lanza un error si ya existe un usuario con el mismo ID.
     * @throws {Error} - Lanza un error si el usuario no se pudo añadir.
     */
    async agregarUsuario(nuevoUsuario) {
        try {
            await this.conexion.connect();

            const usuarioExistente = await this.collection.findOne({ id: nuevoUsuario.id });
            if (usuarioExistente) {
                throw new Error("Ya existe un usuario con el mismo ID.");
            }

            const resultado = await this.collection.insertOne(nuevoUsuario);
            await this.conexion.close();

            if (resultado.acknowledged) {
                return nuevoUsuario; 
                throw new Error("No se pudo agregar el usuario.");
            }
        } catch (error) {
            await this.conexion.close();
            return { mensaje: `Error: ${error.message}` };
        }
    }

        /**
     * Busca un usuario en la base de datos por su identificador único.
     * Si el usuario es de tipo 'VIP', también busca y agrega información de su tarjeta VIP.
     *
     * @param {string} id - El identificador único del usuario a buscar.
     *
     * @returns {Object|Promise} - Si el usuario se encuentra, devuelve un objeto con la información del usuario.
     * Si la tarjeta VIP está asociada, también se incluye información sobre la tarjeta.
     * Si el usuario no se encuentra, devuelve un objeto con un mensaje de error.
     * Si se produce un error durante la búsqueda, también devuelve un objeto con un mensaje de error.
     */
    async buscarUsuarioPorId(id) {
        try {
            await this.conexion.connect();

            const usuario = await this.collection.findOne({ id });

            if (!usuario) {
                await this.conexion.close();
                return { mensaje: "Usuario no encontrado." };
            }

            if (usuario.rol === 'VIP') {
                const tarjetaColeccion = this.db.collection('tarjeta_vip');
                const tarjetaVip = await tarjetaColeccion.findOne({ id_usuario: id });

                if (tarjetaVip) {
                    usuario.tarjeta_vip = {
                        numero_tarjeta: tarjetaVip.numero_tarjeta,
                        descuento: tarjetaVip.descuento,
                        fecha_expiracion: tarjetaVip.fecha_expiracion,
                        estado: tarjetaVip.estado
                    };
                } else {
                    usuario.tarjeta_vip = { mensaje: "Tarjeta VIP no encontrada." };
                }
            }

            await this.conexion.close();
            return usuario;
        } catch (error) {
            await this.conexion.close();
            return { mensaje: `Error: ${error.message}` };
        }
    }

    /**
 * Actualiza el rol de un usuario en la base de datos.
 *
 * @param {string} id - El identificador único del usuario a actualizar.
 * @param {string} nuevoRol - El nuevo rol a asignar al usuario.
 *
 * @returns {Promise<Object|null>} - Si la actualización es exitosa, devuelve el objeto de usuario actualizado.
 * Si la actualización falla debido a que el usuario ya tiene el rol especificado, devuelve un objeto de error.
 * Si se produce un error durante el proceso de actualización, devuelve un objeto de error con el mensaje de error.
 *
 * @throws {Error} - Lanza un error si el usuario no existe o si la actualización falla.
 */
async cambiarRolUsuario(id, nuevoRol) {
    try {
        await this.conexion.connect();

        const resultado = await this.collection.updateOne(
            { id },
            { $set: { rol: nuevoRol } }
        );

        if (resultado.modifiedCount === 0) {
            throw new Error("No se pudo actualizar el rol del usuario, ya tiene este rol");
        }

        const usuarioActualizado = await this.collection.findOne({ id });
        await this.conexion.close();
        return usuarioActualizado;
    } catch (error) {
        await this.conexion.close();
        return { mensaje: `Error: ${error.message}` };
    }
}

    /**
 * Busca y devuelve todos los usuarios con un rol específico en la base de datos.
 *
 * @param {string} rol - El rol a buscar en la base de datos.
 *
 * @returns {Promise<Object[]|Object>} - Si se encuentran usuarios con el rol especificado,
 * devuelve un array de objetos de usuario. Si no se encuentran usuarios, devuelve un objeto con un mensaje de error.
 * Si se produce un error durante la búsqueda, también devuelve un objeto con un mensaje de error.
 */
async buscarUsuariosPorRol(rol) {
    try {
        await this.conexion.connect();

        const usuarios = await this.collection.find({ rol }).toArray();

        if (usuarios.length === 0) {
            await this.conexion.close();
            return { mensaje: "No se encontraron usuarios con el rol especificado." };
        }

        await this.conexion.close();
        return usuarios;
    } catch (error) {
        await this.conexion.close();
        return { mensaje: `Error: ${error.message}` };
    }
}

    destructor() {
        rol.instanceRol = undefined;
        connect.instanceConnect = undefined;
    }
}