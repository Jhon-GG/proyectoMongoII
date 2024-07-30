
// Administrador

db.createRole({
    role: "administrador",
    privileges: [
      {
          resource: { db: "cineCampus", collection: "asiento" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "boleto" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "horario_funcion" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "pelicula" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "reserva" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "sala" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "tarjeta_vip" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        },
        {
          resource: { db: "cineCampus", collection: "usuario" },
          actions: ["find", "remove", "update", "insert", "createCollection", "dropCollection"]
        }
    ],
    roles: []
  })

  

// Usuario Estandar

db.createRole(
	{
		role: "usuarioEstandar",
        privileges: [
      {
            resource: {db: "cineCampus", collection: "pelicula"},
            actions: ["find"]
            },
            {
            resource: {db: "cineCampus", collection: "boleto"},
            actions: ["find", "insert"]
            },
            {
            resource: {db: "cineCampus", collection: "sala"},
            actions: ["find"]
            },
            {
            resource: {db: "cineCampus", collection: "reserva"},
            actions: ["find", "insert", "update"]
            },
            {
            resource: {db: "cineCampus", collection: "asiento"},
            actions: ["find", "insert", "update"]
            },
              {
            resource: { db: "cineCampus", collection: "", command: { aggregate: "pelicula" } },
            actions: ["find"]
              },
            {
            resource: {db: "cineCampus", collection: "usuario"},
            actions: ["insert", "update"]
            }
        ],
            roles: []
	}
)


// Usuarui Vip

db.createRole(
	{
		role: "usuarioVip",
        privileges: [
      {
            resource: {db: "cineCampus", collection: "pelicula"},
            actions: ["find"]
            },
            {
            resource: {db: "cineCampus", collection: "boleto"},
            actions: ["find", "insert"]
            },
            {
            resource: {db: "cineCampus", collection: "sala"},
            actions: ["find"]
            },
            {
            resource: {db: "cineCampus", collection: "reserva"},
            actions: ["find", "insert", "update"]
            },
            {
            resource: {db: "cineCampus", collection: "asiento"},
            actions: ["find", "insert", "update"]
            },
              {
            resource: { db: "cineCampus", collection: "", command: { aggregate: "pelicula" } },
            actions: ["find"]
              },
            {
            resource: {db: "cineCampus", collection: "usuario"},
            actions: ["insert", "update"]
            }
        ],
            roles: []
	}
)