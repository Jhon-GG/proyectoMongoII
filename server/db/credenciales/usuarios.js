// ---------------------------------------------------- USUARIOS ESTANDAR ----------------------------------------------------

db.createUser({
  user: "carlitos",
  pwd: "123456789",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "juancho",
  pwd: "112233445",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "luisito",
  pwd: "223344556",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "mike",
  pwd: "334455667",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "dave",
  pwd: "445566778",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})



db.createUser({
  user: "josem",
  pwd: "556677889",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "andy",
  pwd: "778899001",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})




db.createUser({
  user: "richy",
  pwd: "112233445",
  roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
})






// ---------------------------------------------------- USUARIOS VIP ----------------------------------------------------

db.createUser({
user: "mari",
pwd: "987654321",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})



db.createUser({
user: "anita",
pwd: "556677889",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})




db.createUser({
user: "sofi",
pwd: "667788990",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})



db.createUser({
user: "lau",
pwd: "778899001",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})



db.createUser({
user: "isa",
pwd: "889900112",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})



db.createUser({
user: "pati",
pwd: "667788990",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})



db.createUser({
user: "fer",
pwd: "889900112",
roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})






// ---------------------------------------------------- USUARIOS ADMINISTRADOR ----------------------------------------------------


db.createUser({
user: "jazmin",
pwd: "987654321",
roles: [ { role: "dbOwner", db: "cineCampus" } ]
})



db.createUser({
user: "felipepe",
pwd: "234567890",
roles: [ { role: "dbOwner", db: "cineCampus" } ]
})




db.createUser({
user: "mariiangel",
pwd: "345678901",
roles: [ { role: "dbOwner", db: "cineCampus" } ]
})
