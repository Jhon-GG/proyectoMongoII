const  connect  = require ("../../server/db/connect.js")
const { ObjectId } = require ("mongodb")


// 2. Compra de boletos

module.exports = class boleto extends connect {
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

        const boletoConMismoAsiento = await this.collection.findOne({
            id_pelicula: nuevoBoleto.id_pelicula,
            id_horario_funcion: nuevoBoleto.id_horario_funcion,
            asiento: nuevoBoleto.asiento
        });
    
        if (boletoConMismoAsiento) {
            await this.conexion.close();
            return { mensaje: "Error, asiento ocupado en ese horario." };
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
    


    async compraRealizacion(detallesBoletoUser) {
        try {
          await this.conexion.connect();
      
          // Verificar si el boleto ya existe
          const boletoExistente = await this.collection.findOne({ id: parseInt(detallesBoletoUser.id, 10) });
          if (boletoExistente) {
            throw new Error('El ID del boleto ya existe.');
          }
      
          // Verificar si la película existe y está disponible
          const pelicula = await this.db.collection('pelicula').findOne({
            id: parseInt(detallesBoletoUser.id_pelicula, 10),
            estado: { $in: ["En cartelera", "Próximo estreno"] }
          });
          if (!pelicula) {
            throw new Error('La película no existe o no está disponible para compra de boletos.');
          }
      
          // Verificar el horario de proyección
          const horarioProyeccion = await this.db.collection('horario_funcion').findOne({
            id: parseInt(detallesBoletoUser.id_horario_proyeccion, 10),
            id_pelicula: parseInt(detallesBoletoUser.id_pelicula, 10)
          });
          if (!horarioProyeccion) {
            throw new Error('El horario de proyección no es válido para esta película.');
          }
      
          // Verificar si el usuario existe
          const usuario = await this.db.collection('usuario').findOne({ id: parseInt(detallesBoletoUser.id_usuario, 10) });
          if (!usuario) {
            throw new Error('El usuario especificado no existe.');
          }
      
          // Verificar la sala
          const sala = await this.db.collection('sala').findOne({ id: parseInt(horarioProyeccion.id_sala, 10) });
          if (!sala) {
            throw new Error('No se encontró la sala asociada a este horario de proyección.');
          }
      
          // Verificar si los asientos son válidos para la sala
          const asientosValidos = detallesBoletoUser.asientos_comprados.every(asientoId => 
            sala.asientos.includes(parseInt(asientoId, 10))
          );
          if (!asientosValidos) {
            throw new Error('Uno o más asientos seleccionados no pertenecen a la sala de esta proyección.');
          }
      
          // Verificar disponibilidad de asientos
          const asientosDisponibles = await this.db.collection('asiento').countDocuments({
            id: { $in: detallesBoletoUser.asientos_comprados.map(id => parseInt(id, 10)) },
            estado: 'disponible'
          });
          if (asientosDisponibles !== detallesBoletoUser.asientos_comprados.length) {
            throw new Error('Uno o más asientos seleccionados no están disponibles.');
          }
      
          // Obtener el precio del asiento
          const asiento = await this.db.collection('asiento').findOne({
            id: parseInt(detallesBoletoUser.asientos_comprados[0], 10)
          });
          const precioAsiento = asiento.Precio;
      
          // Calcular descuento
          let descuento = 0;
          let mensajeDescuento = '';
          if (usuario.rol.toLowerCase() === 'vip') {
            const tarjetaVIP = await this.db.collection('tarjeta_vip').findOne({
              id_usuario: parseInt(usuario.id, 10)
            });
            if (tarjetaVIP) {
              if (tarjetaVIP.estado === 'activa') {
                descuento = tarjetaVIP.descuento;
                mensajeDescuento = `Querido usuario VIP tu tarjeta está (${tarjetaVIP.estado}) y por eso te hemos otorgado un descuento de: ${descuento}%`;
              } else {
                mensajeDescuento = `Lo sentimos mucho querido usuario VIP pero tu tarjeta está (${tarjetaVIP.estado}) por eso no hemos podido realizarte un descuento, te invitamos a que vuelvas a activar tu tarjeta`;
              }
            } else {
              mensajeDescuento = 'Eres un cliente VIP, pero no tienes una tarjeta registrada. No se aplicó descuento.';
            }
          } else if (usuario.rol.toLowerCase() === 'estandar') {
            mensajeDescuento = 'No se aplicó descuento por no ser usuario VIP. Puedes adquirir una tarjeta VIP para obtener descuentos en futuras compras.';
          }
      
          // Calcular precio total
          const precioBase = (horarioProyeccion.precio_pelicula + precioAsiento) * detallesBoletoUser.asientos_comprados.length;
          const total = precioBase - (precioBase * (descuento / 100));
      
          // Crear nuevo boleto
          const nuevoBoleto = {
            ...detallesBoletoUser,
            total: total,
            descuento_aplicado: descuento,
            fecha_compra: new Date().toLocaleDateString('es-ES'),
            estado_compra: 'completada'
          };
      
          // Insertar nuevo boleto
          await this.collection.insertOne(nuevoBoleto);
      
          // Actualizar estado de los asientos
          await this.db.collection('asiento').updateMany(
            { id: { $in: detallesBoletoUser.asientos_comprados.map(id => parseInt(id, 10)) } },
            { $set: { estado: 'ocupado' } }
          );
      
          await this.conexion.close();
      
          // Preparar mensajes de respuesta
          let mensajeRespuesta = 'Compra realizada con éxito.';
          let mensajeModoCompra = detallesBoletoUser.modo_compra === 'virtual'
            ? 'Su compra virtual se ha realizado satisfactoriamente.'
            : 'Su compra presencial se ha realizado satisfactoriamente.';
          let mensajeConfirmacion = 'Su compra ha sido confirmada. Gracias por su preferencia.';
      
          return {
            mensaje: mensajeRespuesta,
            mensajeConfirmacion: mensajeConfirmacion,
            mensajeDescuento: mensajeDescuento,
            mensajeModoCompra: mensajeModoCompra,
            detallesBoleto: nuevoBoleto
          };
        } catch (error) {
          await this.conexion.close();
          return { error: `Error al realizar la compra: ${error.message}` };
        }
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

////////////////////

    async informacionhorarios(idPelicula) {
        try {
            await this.conexion.connect();

            const idPeliculaNum = parseInt(idPelicula);
            const pelicula = await this.db.collection('pelicula').findOne({ id: idPeliculaNum });
            if (!pelicula) {
                throw new Error('Película no encontrada.');
            }

            const horariosProyeccion = await this.db.collection('horario_funcion')
                .find({ id_pelicula: idPeliculaNum }).toArray();

            const infoCompleta = await Promise.all(horariosProyeccion.map(async (horario) => {
                const sala = await this.db.collection('sala').findOne({ id: horario.id_sala });
                if (!sala) {
                    throw new Error(`Sala no encontrada para el horario ${horario.id}.`);
                }

                const asientos = await this.db.collection('asiento')
                    .find({ id: { $in: sala.asientos } }).toArray();

                const boletosVendidos = await this.db.collection('boletos')
                    .find({ id_horario_funcion: horario.id }).toArray();
                const asientosOcupados = boletosVendidos.flatMap(boleto => boleto.asientos_comprados);

                const asientosConEstado = asientos.map(asiento => {
                    if (asiento.estado === 'reservado') {
                        return asiento;
                    } else if (asientosOcupados.includes(asiento.id)) {
                        return {
                            ...asiento,
                            estado: 'ocupado'
                        };
                    }
                    return asiento;
                });

                return {
                    horario: {
                        id: horario.id,
                        fecha_proyeccion: horario.fecha_proyeccion,
                        horario_proyeccion: horario.id_horario_funcion, 
                        horario_proyeccion:horario.horario_proyeccion,
                        hora_finalizacion: horario.hora_finalizacion,
                        precio_pelicula: horario.precio_pelicula
                    },
                    sala: {
                        id: sala.id,
                        nombre: sala.nombre,
                        tipo: sala.tipo,
                        descripcion: sala.descripcion,
                        capacidad: sala.capacidad
                    },
                    asientos: asientosConEstado
                };
            }));

            await this.conexion.close();

            return {
                pelicula: {
                    id: pelicula.id,
                    titulo: pelicula.titulo,
                    sinopsis: pelicula.sinopsis,
                    fecha_estreno: pelicula.fecha_estreno,
                    genero: pelicula.genero,
                    duracion: pelicula.duracion,
                    estado: pelicula.estado,
                    pais_origen: pelicula.pais_origen,
                    imagen_pelicula: pelicula.imagen_pelicula,
                    portada: pelicula.portada,
                    reparto: pelicula.reparto,
                    trailer: pelicula.trailer
                },
                proyecciones: infoCompleta
            };

        } catch (error) {
            await this.conexion.close();
            throw error;
        }
    }
}