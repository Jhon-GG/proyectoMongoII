
// ---------------------------------------------------- USUARIOS ESTANDAR ----------------------------------------------------

db.createUser({
    user: "carlitos",
    pwd: "123456789",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

//   conexion: mongodb://carlitos:123456789@roundhouse.proxy.rlwy.net:48985/cineCampus  


db.createUser({
    user: "juancho",
    pwd: "112233445",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

//   conexion: mongodb://juancho:112233445@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
    user: "luisito",
    pwd: "223344556",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

// conexion: mongodb://luisito:223344556@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
    user: "mike",
    pwd: "334455667",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

// conexion: mongodb://mike:334455667@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
    user: "dave",
    pwd: "445566778",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

// conexion: mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
    user: "josem",
    pwd: "556677889",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

// conexion: mongodb://josem:556677889@roundhouse.proxy.rlwy.net:48985/cineCampus 


db.createUser({
    user: "andy",
    pwd: "778899001",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

// conexion: mongodb://andy:778899001@roundhouse.proxy.rlwy.net:48985/cineCampus 


db.createUser({
    user: "richy",
    pwd: "112233445",
    roles: [ { role: "usuarioEstandar", db: "cineCampus" } ]
  })

  
// conexion: mongodb://richy:112233445@roundhouse.proxy.rlwy.net:48985/cineCampus 



// ---------------------------------------------------- USUARIOS VIP ----------------------------------------------------

db.createUser({
  user: "mari",
  pwd: "987654321",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://mari:987654321@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
  user: "anita",
  pwd: "556677889",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://anita:556677889@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
  user: "sofi",
  pwd: "667788990",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://sofi:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
  user: "lau",
  pwd: "778899001",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://lau:778899001@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
  user: "isa",
  pwd: "889900112",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://isa:889900112@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
  user: "pati",
  pwd: "667788990",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
  user: "fer",
  pwd: "889900112",
  roles: [ { role: "usuarioVip", db: "cineCampus" } ]
})

// conexion: mongodb://fer:889900112@roundhouse.proxy.rlwy.net:48985/cineCampus




// ---------------------------------------------------- USUARIOS ADMINISTRADOR ----------------------------------------------------


db.createUser({
  user: "jazmin",
  pwd: "987654321",
  roles: [ { role: "administrador", db: "cineCampus" } ]
})

// conexion: mongodb://jazmin:987654321@roundhouse.proxy.rlwy.net:48985/cineCampus

db.createUser({
  user: "felipepe",
  pwd: "234567890",
  roles: [ { role: "administrador", db: "cineCampus" } ]
})

// conexion: mongodb://felipepe:234567890@roundhouse.proxy.rlwy.net:48985/cineCampus


db.createUser({
  user: "mariiangel",
  pwd: "345678901",
  roles: [ { role: "administrador", db: "cineCampus" } ]
})

// conexion: mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus