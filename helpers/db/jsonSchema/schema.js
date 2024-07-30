
// ASIENTO

// {
//     $jsonSchema: {
//       bsonType: 'object',
//       required: [
//         'id',
//         'numero',
//         'estado',
//         'tipo'
//       ],
//       properties: {
//         _id: {
//           bsonType: 'objectId',
//           description: 'Identificador único del documento.'
//         },
//         id: {
//           bsonType: 'int',
//           description: 'Identificador numérico del asiento.'
//         },
//         numero: {
//           bsonType: 'string',
//           description: 'Número del asiento.'
//         },
//         estado: {
//           bsonType: 'string',
//           description: 'Estado del asiento (reservado / comprado / disponible).',
//           'enum': [
//             'reservado',
//             'comprado',
//             'disponible'
//           ]
//         },
//         tipo: {
//           bsonType: 'string',
//           description: 'Tipo de asiento (discapacitado / preferencial / standar / VIP).',
//           'enum': [
//             'discapacitado',
//             'preferencial',
//             'standar',
//             'VIP'
//           ]
//         }
//       }
//     }
//   }




// BOLETO


// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'id_pelicula',
//       'id_horario_funcion',
//       'id_usuario',
//       'asiento',
//       'tipo_compra',
//       'fecha_compra',
//       'metodo_pago',
//       'estado_compra',
//       'total'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'ID único del boleto'
//       },
//       id_pelicula: {
//         bsonType: 'int',
//         description: 'ID de la película'
//       },
//       id_horario_funcion: {
//         bsonType: 'int',
//         description: 'ID del horario de la función'
//       },
//       id_usuario: {
//         bsonType: 'int',
//         description: 'ID del usuario que compra el boleto'
//       },
//       id_reserva: {
//         bsonType: [
//           'int',
//           'null'
//         ],
//         description: 'ID de la reserva, puede ser null'
//       },
//       asiento: {
//         bsonType: 'string',
//         description: 'Asiento comprado'
//       },
//       tipo_compra: {
//         bsonType: 'string',
//         'enum': [
//           'presencial',
//           'virtual'
//         ],
//         description: 'Tipo de compra (presencial / virtual)'
//       },
//       fecha_compra: {
//         bsonType: 'string',
//         pattern: '^\\d{4}-\\d{2}-\\d{2}$',
//         description: 'Fecha de compra del boleto en formato YYYY-MM-DD'
//       },
//       metodo_pago: {
//         bsonType: 'string',
//         description: 'Método de pago del boleto'
//       },
//       estado_compra: {
//         bsonType: 'string',
//         'enum': [
//           'realizado',
//           'pendiente',
//           'no realizado'
//         ],
//         description: 'Estado de la compra (realizado / pendiente / no realizado)'
//       },
//       total: {
//         bsonType: 'int',
//         description: 'Total del costo del boleto'
//       }
//     }
//   }
// }





// HORARIO_FUNCION


// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'id_pelicula',
//       'id_sala',
//       'fecha_funcion',
//       'hora_funcion',
//       'precio'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'ID único para la función'
//       },
//       id_pelicula: {
//         bsonType: 'int',
//         description: 'ID de la película'
//       },
//       id_sala: {
//         bsonType: 'int',
//         description: 'ID de la sala'
//       },
//       fecha_funcion: {
//         bsonType: 'string',
//         description: 'Fecha de la función'
//       },
//       hora_funcion: {
//         bsonType: 'string',
//         description: 'Hora de la función en formato HH:MM'
//       },
//       precio: {
//         bsonType: 'int',
//         description: 'Precio de la entrada para la función'
//       }
//     }
//   }
// }




// PELICULA


// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'titulo',
//       'genero',
//       'duracion',
//       'estado',
//       'sinopsis',
//       'estreno',
//       'director'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId',
//         description: 'Identificador único del documento.'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'Identificador numérico de la película.'
//       },
//       titulo: {
//         bsonType: 'string',
//         description: 'Título de la película.'
//       },
//       genero: {
//         bsonType: 'string',
//         description: 'Género de la película.'
//       },
//       duracion: {
//         bsonType: 'string',
//         description: 'Duración de la película en formato \'h m\'.'
//       },
//       estado: {
//         bsonType: 'string',
//         description: 'Estado de la película (en cartelera / próximo estreno).'
//       },
//       sinopsis: {
//         bsonType: 'string',
//         description: 'Resumen de la película.'
//       },
//       estreno: {
//         bsonType: 'string',
//         description: 'Fecha de estreno de la película.'
//       },
//       director: {
//         bsonType: 'string',
//         description: 'Nombre del director de la película.'
//       }
//     }
//   }
// }





// RESERVA

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'id_usuario',
//       'fecha_reserva',
//       'estado',
//       'expiracion',
//       'asientos',
//       'id_pelicula',
//       'id_horario_funcion'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'ID único de la reserva'
//       },
//       id_usuario: {
//         bsonType: 'int',
//         description: 'ID del usuario que realiza la reserva'
//       },
//       fecha_reserva: {
//         bsonType: 'string',
//         pattern: '^\\d{4}-\\d{2}-\\d{2}$',
//         description: 'Fecha de la reserva en formato YYYY-MM-DD'
//       },
//       estado: {
//         bsonType: 'string',
//         'enum': [
//           'activa',
//           'cancelada',
//           'expirada'
//         ],
//         description: 'Estado de la reserva (activa / cancelada / expirada)'
//       },
//       expiracion: {
//         bsonType: 'string',
//         pattern: '^\\d{4}-\\d{2}-\\d{2}$',
//         description: 'Fecha de expiración de la reserva en formato YYYY-MM-DD'
//       },
//       asientos: {
//         bsonType: 'array',
//         items: {
//           bsonType: 'int'
//         },
//         description: 'Array de los asientos reservados'
//       },
//       id_pelicula: {
//         bsonType: 'int',
//         description: 'ID de la película reservada'
//       },
//       id_horario_funcion: {
//         bsonType: 'int',
//         description: 'ID del horario de la función'
//       }
//     }
//   }
// }





// SALA

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'nombre',
//       'descripcion',
//       'capacidad',
//       'asientos'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'Identificador único para la sala.'
//       },
//       nombre: {
//         bsonType: 'string',
//         description: 'Nombre de la sala.'
//       },
//       descripcion: {
//         bsonType: 'string',
//         description: 'Descripción breve de la sala.'
//       },
//       capacidad: {
//         bsonType: 'int',
//         description: 'Capacidad total de la sala.'
//       },
//       asientos: {
//         bsonType: 'array',
//         description: 'Lista de identificadores de los asientos en la sala.',
//         items: {
//           bsonType: 'int',
//           description: 'Identificador del asiento.'
//         }
//       }
//     }
//   }
// }









// TARJETA_VIP

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'id_usuario',
//       'numero_tarjeta',
//       'descuento',
//       'fecha_expiracion',
//       'estado'
//     ],
//     properties: {
//       _id: {
//         bsonType: 'objectId'
//       },
//       id: {
//         bsonType: 'int',
//         description: 'ID único de la tarjeta VIP'
//       },
//       id_usuario: {
//         bsonType: 'int',
//         description: 'ID del usuario asociado'
//       },
//       numero_tarjeta: {
//         bsonType: 'int',
//         description: 'Número de la tarjeta VIP'
//       },
//       descuento: {
//         bsonType: 'int',
//         minimum: 0,
//         maximum: 100,
//         description: 'Descuento de la tarjeta VIP en porcentaje'
//       },
//       fecha_expiracion: {
//         bsonType: 'string',
//         pattern: '^\\d{4}-\\d{2}-\\d{2}$',
//         description: 'Fecha de expiración de la tarjeta VIP en formato YYYY-MM-DD'
//       },
//       estado: {
//         bsonType: 'string',
//         'enum': [
//           'activa',
//           'inactiva'
//         ],
//         description: 'Estado de la tarjeta VIP (activa / inactiva)'
//       }
//     }
//   }
// }







// USUARIO

// {
//   $jsonSchema: {
//     bsonType: 'object',
//     required: [
//       'id',
//       'nombre',
//       'apellido',
//       'cc',
//       'alias',
//       'rol',
//       'email',
//       'celular'
//     ],
//     properties: {
//       id: {
//         bsonType: [
//           'int',
//           'double'
//         ],
//         description: 'Debe ser un número y es requerido.'
//       },
//       nombre: {
//         bsonType: 'string',
//         description: 'Debe ser una cadena y es requerido.'
//       },
//       apellido: {
//         bsonType: 'string',
//         description: 'Debe ser una cadena y es requerido.'
//       },
//       cc: {
//         bsonType: [
//           'int',
//           'double'
//         ],
//         description: 'Debe ser un número representando el número de cédula y es requerido.'
//       },
//       alias: {
//         bsonType: 'string',
//         description: 'Debe ser una cadena y es requerido.'
//       },
//       rol: {
//         bsonType: 'string',
//         description: 'Debe ser una cadena y es requerido.'
//       },
//       email: {
//         bsonType: 'string',
//         description: 'Debe ser una cadena con formato de email y es requerido.'
//       },
//       celular: {
//         bsonType: [
//           'int',
//           'double'
//         ],
//         description: 'Debe ser un número representando el número de celular y es requerido.'
//       }
//     }
//   }
// }