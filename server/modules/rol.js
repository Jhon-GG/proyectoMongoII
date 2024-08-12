const  connect  = require ('../../server/db/connect.js')
const { ObjectId } = require ("mongodb")

// 5. Roles definidos


class Rol extends connect {
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
    
    
        async crearUsuario(datosUsuario) {
            let client;
            try {
              client = await this.conexion.connect();
              const db = client.db('cineCampus');
              const usuarios = db.collection('usuario');
              const tarjetasVIP = db.collection('tarjeta_vip');
          
              const camposUnicos = ['id', 'alias', 'email', 'celular', 'cc'];
              for (let campo of camposUnicos) {
                const usuarioExistente = await usuarios.findOne({ [campo]: datosUsuario[campo] });
                if (usuarioExistente) {
                  return { error: `Error al crear el usuario: Ya existe un usuario con el mismo ${campo}.` };
                }
              }
          
              const usuarioNombreExistente = await usuarios.findOne({
                nombre_completo: { $regex: new RegExp('^' + datosUsuario.nombre_completo + '$', 'i') }
              });
              if (usuarioNombreExistente) {
                return { error: 'Error al crear el usuario: Ya existe un usuario con el mismo nombre completo.' };
              }
          
              if (!['VIP', 'Estandar', 'Administrador'].includes(datosUsuario.rol)) {
                return { error: 'Error al crear el usuario: Rol de usuario no válido' };
              }
          
              const resultado = await usuarios.insertOne(datosUsuario);
              const nuevoUsuarioId = resultado.insertedId;
          
              let tarjetaVIP = null;
          
              if (datosUsuario.rol === 'Administrador') {
                await db.command({
                  createUser: datosUsuario.alias,
                  pwd: datosUsuario.cc,
                  roles: [{ role: "dbOwner", db: "cineCampus" }]
                });
              } else {
                let rolDB = datosUsuario.rol === 'VIP' ? 'usuarioVip' : 'usuarioEstandar';
                await db.command({
                  createUser: datosUsuario.alias,
                  pwd: datosUsuario.cc,
                  roles: [{ role: rolDB, db: 'cineCampus' }]
                });
          
                if (datosUsuario.rol === 'VIP') {
                  const ultimaTarjeta = await tarjetasVIP.findOne({}, { sort: { id: -1 } });
                  const nuevoIdTarjeta = (ultimaTarjeta ? ultimaTarjeta.id : 0) + 1;
                  
                  tarjetaVIP = {
                    id: nuevoIdTarjeta,
                    id_usuario: datosUsuario.id,
                    numero_tarjeta: Math.floor(1000000000 + Math.random() * 9000000000), // Genera un número de 10 dígitos
                    descuento: 20,
                    fecha_expiracion: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
                    estado: "activa"
                  };
          
                  
                  tarjetaVIP.id = parseInt(tarjetaVIP.id);
                  tarjetaVIP.id_usuario = parseInt(tarjetaVIP.id_usuario);
                  tarjetaVIP.numero_tarjeta = parseInt(tarjetaVIP.numero_tarjeta);
                  tarjetaVIP.descuento = parseInt(tarjetaVIP.descuento);
          
                  await tarjetasVIP.insertOne(tarjetaVIP);
                }
              }
          
              const respuesta = {
                mensaje: 'Usuario creado con éxito',
                usuario: {
                  id: datosUsuario.id,
                  nombre_completo: datosUsuario.nombre_completo,
                  alias: datosUsuario.alias,
                  rol: datosUsuario.rol
                }
              };
          
              if (tarjetaVIP) {
                respuesta.tarjeta_vip = tarjetaVIP;
              }
          
              return respuesta;
            } catch (error) {
              return { message: `Usuario creado exitosamente` };
            } finally {
              if (client) {
                await client.close();
              }
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
    
                const usuario = await this.collection.findOne({ id: parseInt(id) });
    
                if (!usuario) {
                    await this.conexion.close();
                    return { mensaje: "Usuario no encontrado." };
                }
    
                if (usuario.rol === 'VIP') {
                    const tarjetaColeccion = this.db.collection('tarjeta_vip');
                    const tarjetaVip = await tarjetaColeccion.findOne({ id_usuario: parseInt(id) });
    
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
 * @param {string} rol - El nuevo rol a asignar al usuario.
 *
 * @returns {Promise<Object|null>} - Si la actualización es exitosa, devuelve el objeto de usuario actualizado.
 * Si la actualización falla debido a que el usuario ya tiene el rol especificado, devuelve un objeto de error.
 * Si se produce un error durante el proceso de actualización, devuelve un objeto de error con el mensaje de error.
 *
 * @throws {Error} - Lanza un error si el usuario no existe o si la actualización falla.
 */
    async cambiarRolUsuario(datosActualizados) {
        let cliente;
        try {
            cliente = await this.conexion.connect();
            const baseDatos = cliente.db('cineCampus');
            const coleccionUsuarios = baseDatos.collection('usuario');
            const coleccionTarjetasVip = baseDatos.collection('tarjeta_vip');
    
            const { id, rol } = datosActualizados;
    
            if (rol !== 'VIP' && rol !== 'Estandar') {
                return { error: 'El rol especificado no es válido. Por favor, elige entre VIP o Estandar' };
            }
    
            const usuarioEncontrado = await coleccionUsuarios.findOne({ id: parseInt(id) });
            if (!usuarioEncontrado) {
                return { error: "No pudimos encontrar al usuario. ¿Estás seguro de que existe?" };
            }
    
            if (rol === 'Administrador' || usuarioEncontrado.rol === 'Administrador') {
                return { error: 'No se permite modificar el rol de Administrador' };
            }
    
            if (usuarioEncontrado.rol === rol) {
                return { mensaje: 'No hay cambios, el usuario ya tiene ese rol. Todo sigue igual.' };
            }
    
            // Actualizar solo el campo rol
            const resultado = await coleccionUsuarios.updateOne(
                { id: parseInt(id) },
                { $set: { rol: rol } }
            );
    
            if (resultado.matchedCount === 0) {
                return { error: "No pudimos encontrar al usuario. ¿Estás seguro de que existe?" };
            }
    
            if (resultado.modifiedCount === 0) {
                return { mensaje: 'No hay cambios, el usuario ya tiene ese rol. Todo sigue igual.' };
            }
    
            if (rol === "VIP") {
                let tarjetaVIP = await coleccionTarjetasVip.findOne({ id_usuario: parseInt(id) });
                if (tarjetaVIP) {
                    await coleccionTarjetasVip.updateOne(
                        { id_usuario: parseInt(id) },
                        { $set: { estado: "activa" } }
                    );
                    return { mensaje: '¡Bienvenido de vuelta al club VIP! Tu tarjeta dorada ha sido activada de nuevo' };
                } else {
                    const ultimaTarjeta = await coleccionTarjetasVip.findOne({}, { sort: { id: -1 } });
                    const nuevoIdTarjeta = (ultimaTarjeta ? ultimaTarjeta.id : 0) + 1;
    
                    const nuevaTarjetaVIP = {
                        id: nuevoIdTarjeta,
                        id_usuario: parseInt(id),
                        numero_tarjeta: Math.floor(1000000000 + Math.random() * 9000000000),
                        descuento: 20,
                        fecha_expiracion: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
                        estado: "activa"
                    };
    
                    await coleccionTarjetasVip.insertOne(nuevaTarjetaVIP);
                    return { mensaje: '¡Felicidades! Ascendido a VIP. Tu nueva tarjeta te está esperando.' };
                }
            } else if (rol === "Estandar") {
                const tarjetaVIP = await coleccionTarjetasVip.findOne({ id_usuario: parseInt(id) });
                if (tarjetaVIP) {
                    await coleccionTarjetasVip.updateOne(
                        { id_usuario: parseInt(id) },
                        { $set: { estado: "inactiva" } }
                    );
                    return { mensaje: 'Has vuelto a Estandar, pronto esperamos tu regreso' };
                } else {
                    return { mensaje: 'Bienvenido a Estandar' };
                }
            }
    
            let rolBaseDatos = rol === 'VIP' ? 'userVip' : 'userEstandar';
            await baseDatos.command({
                updateUser: usuarioEncontrado.alias,
                roles: [{ role: rolBaseDatos, db: 'cineCampus' }]
            });
    
            return { mensaje: 'Tu nuevo rol te espera.' };
        } catch (error) {
            console.error('Error detallado:', error);
            return { error: `No pudimos actualizar el rol: ${error.message}` };
        } finally {
            if (cliente) {
                await cliente.close();
            }
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

module.exports = Rol;