
// Administrador

db.createUser({
  user: "Administrador",
  pwd: "admin123",
  roles: [
      { role: "dbOwner", db: "cineCampus" }
  ]
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
            }
        ],
            roles: []
	}
)


// Usuario Vip

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
              resource: {db: "cineCampus", collection: "tarjeta_vip"},
              actions: ["find", "insert"]
            },
            {
            resource: { db: "cineCampus", collection: "", command: { aggregate: "pelicula" } },
            actions: ["find"]  
            },
        ],
            roles: []
	}
)