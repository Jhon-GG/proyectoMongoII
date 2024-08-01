# Instalaciones necesarias

```js
npm i mongodb
```

# Comando de ejecucion del archivo main.js

```js
npm run dev
```

### Proyecto: CineCampus

#### Problematica

CineCampus es una empresa de entretenimiento que se especializa en ofrecer una experiencia de cine completa y personalizada. La empresa desea desarrollar una aplicación web que permita a los usuarios seleccionar películas, comprar boletos y asignar asientos de manera eficiente y cómoda. La aplicación también ofrecerá opciones de descuento para usuarios con tarjeta VIP y permitirá realizar compras en línea.

#### Objetivo

Desarrollar una serie de APIs para la aplicación web de CineCampus utilizando MongoDB como base de datos. Las APIs deberán gestionar la selección de películas, la compra de boletos, la asignación de asientos, y la implementación de descuentos para tarjetas VIP, con soporte para diferentes roles de usuario.

#### Requisitos Funcionales

1. **Selección de Películas:**
   - **API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.
   - **API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.
2. **Compra de Boletos:**
   - **API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.
   - **API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.
3. **Asignación de Asientos:**
   - **API para Reservar Asientos:** Permitir la selección y reserva de asientos para una proyección específica.
   - **API para Cancelar Reserva de Asientos:** Permitir la cancelación de una reserva de asiento ya realizada.
4. **Descuentos y Tarjetas VIP:**
   - **API para Aplicar Descuentos:** Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.
   - **API para Verificar Tarjeta VIP:** Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.
5. - Roles Definidos:
     - **Administrador:** Tiene permisos completos para gestionar el sistema, incluyendo la venta de boletos en el lugar físico. Los administradores no están involucrados en las compras en línea realizadas por los usuarios.
     - **Usuario Estándar:** Puede comprar boletos en línea sin la intervención del administrador.
     - **Usuario VIP:** Puede comprar boletos en línea con descuentos aplicables para titulares de tarjetas VIP.
   - **API para Crear Usuario:** Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).
   - **API para Obtener Detalles de Usuario:** Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.
   - **API para Actualizar Rol de Usuario:** Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).
   - **API para Listar Usuarios:** Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).
6. **Compras en Línea:**
   - **API para Procesar Pagos:** Permitir el procesamiento de pagos en línea para la compra de boletos.
   - **API para Confirmación de Compra:** Enviar confirmación de la compra y los detalles del boleto al usuario.

#### Requisitos Técnicos

- **Base de Datos:** Utilizar MongoDB para el almacenamiento de datos relacionados con películas, boletos, asientos, usuarios y roles.
- **Autenticación:** Implementar autenticación segura para el acceso a las APIs, utilizando roles de usuario para determinar los permisos y accesos (por ejemplo, usuarios VIP y usuarios estándar).
- **Autorización de Roles:** Asegurar que las APIs y las operaciones disponibles estén adecuadamente restringidas según el rol del usuario (por ejemplo, aplicar descuentos solo a usuarios VIP).
- **Escalabilidad:** Las APIs deben estar diseñadas para manejar un gran volumen de solicitudes concurrentes y escalar según sea necesario.
- **Documentación:** Proveer una documentación clara y completa para cada API, describiendo los endpoints, parámetros, y respuestas esperadas.

#### Entregables

1. **Código Fuente:** Repositorio en GitHub con el código de las APIs desarrolladas.
2. **Documentación de API:** Documento con la descripción detallada de cada API, incluyendo ejemplos de uso y formato de datos.
3. **Esquema de Base de Datos:** Diseño del esquema de MongoDB utilizado para almacenar la información.

#### Evaluación

- **Funcionalidad:** Cumplimiento de los requisitos funcionales establecidos.
- **Eficiencia:** Desempeño y tiempo de respuesta de las APIs.
- **Seguridad:** Implementación adecuada de medidas de seguridad, autenticación y autorización de roles.
- **Documentación:** Claridad y exhaustividad de la documentación proporcionada.


# ___________________________________________________________________________________

# 1. Selección de Películas:

**API para Listar Películas:** Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.

**API para Obtener Detalles de Película:** Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.


# 1.1 Módulo de Gestión de Películas
Este módulo proporciona funcionalidades para manejar y obtener información sobre películas disponibles en nuestro sistema. Debemos tener en cuenta que este caso de uso tiene dos partes, esta primera parte se encarga de traer todas las peliculas disponibles.

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso:
El siguiente ejemplo muestra cómo utilizar la clase pelicula para obtener la lista de películas disponibles:

```js
let objPelicula = new pelicula();
console.log(await objPelicula.getPeliculas());
objPelicula.destructor();
```

## Funcionalidades
### Clase pelicula

getPeliculas(): Método asíncrono que devuelve un array con la información de todas las películas disponibles.
destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

# Ejemplo de salida
```js
{
    id: 1,
    titulo: 'Bad Boys 4',
    genero: 'Acción / Comedia',
    duracion: '2h 15m',
    estado: 'Próximo estreno',
    estreno: '2024-08-15',
    director: 'Adil & Bilall',
    horarios_funcion: [ [Object] ]
  },
  {
    id: 2,
    titulo: 'Observados',
    genero: 'Thriller / Suspenso',
    duracion: '1h 50m',
    estado: 'En cartelera',
    estreno: '2024-07-10',
    director: 'David F. Sandberg',
    horarios_funcion: [ [Object], [Object] ]
  },
  {
    id: 3,
    titulo: 'Rescate imposible',
    genero: 'Acción / Drama',
    duracion: '2h 5m',
    estado: 'Próximo estreno',
    estreno: '2024-09-20',
    director: 'Michael Bay',
    horarios_funcion: [ [Object] ]
  }
  ```

# Notas importantes

- El método getPeliculas() es asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- Siempre llame al método destructor() cuando haya terminado de usar la instancia para liberar recursos.



# 1.2 Módulo de Gestión de Películas - Búsqueda por ID
Este módulo permite obtener información detallada de una película específica utilizando su ID. Debemos tener en cuenta que este caso de uso tiene dos partes, esta segunda parte se encarga de traer la pelicula que elijamos segun su id, mostrando informacion específica de la misma.

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso
El siguiente ejemplo muestra cómo utilizar la clase pelicula para obtener información de una película por su ID:
```js
const idPeliculaById = 2; 

    let objPelicula = new pelicula();

    console.log(await objPelicula.getPeliculaById(idPeliculaById));

    objPelicula.destructor();

```
## Funcionalidades
### Clase pelicula

getPeliculaById(id): Método asíncrono que devuelve la información de una película específica basada en su ID.
destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

# Ejemplo de salida

```js
{
  id: 2,
  titulo: 'Observados',
  genero: 'Thriller / Suspenso',
  duracion: '1h 50m',
  estado: 'En cartelera',
  sinopsis: 'Un grupo de amigos descubre que están siendo vigilados por una entidad desconocida.',
  estreno: '2024-07-10',
  director: 'David F. Sandberg',
  horarios_funcion: [
    {
      _id: new ObjectId('66a3e31b280e8d342dd414bd'),
      id: 3,
      id_pelicula: 2,
      id_sala: 3,
      fecha_funcion: '2024-07-31',
      hora_funcion: '16:00',
      precio: 120
    },
    {
      _id: new ObjectId('66a3e31b280e8d342dd414be'),
      id: 4,
      id_pelicula: 2,
      id_sala: 4,
      fecha_funcion: '2024-07-31',
      hora_funcion: '19:00',
      precio: 160
    }
  ]
}
```
# Notas importantes

- El parámetro idPeliculaById debe ser un número entero válido correspondiente al ID de una película existente.
- getPeliculaById() es un método asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- Asegúrese de llamar al método destructor() después de usar la instancia para liberar recursos.


# ___________________________________________________________________________________


# 2. Compra de Boletos:


**API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

**API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

# 2.1 Módulo de Gestión de Boletos - Creación de Boletos
Este módulo permite la creación de nuevos boletos para funciones de cine utilizando la clase boleto. Debemos tener en cuenta que esta es la primer parte del caso 2, que se enfoca en la compra de un nuevo boleto.

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso
El siguiente ejemplo muestra cómo crear un nuevo boleto:
```js
const nuevoBoleto = {
    id: 9,
    id_pelicula: 2,
    id_horario_funcion: 17,
    id_usuario: 2,
    id_reserva: null,
    asiento: "A1",
    tipo_compra: "virtual",
    fecha_compra: "2024-07-21",
    metodo_pago: "tarjeta de crédito",
    estado_compra: "realizado",
    total: 0 
  };
  
      let objBoleto = new boleto();
  
          const boletoCreado = await objBoleto.crearBoleto1(nuevoBoleto);
          console.log(boletoCreado);

  
      objBoleto.destructor();
```

## Funcionalidades
### Clase boleto

- crearBoleto1(nuevoBoleto): Método asíncrono que crea un nuevo boleto con la información proporcionada.
- destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

## Ejemplo de salida

```js
Boleto creado:  {
  id: 9,
  id_pelicula: 2,
  id_horario_funcion: 17,
  id_usuario: 2,
  id_reserva: null,
  asiento: 'A1',
  tipo_compra: 'virtual',
  fecha_compra: '2024-07-21',
  metodo_pago: 'tarjeta de crédito',
  estado_compra: 'realizado',
  total: 96,
  fecha_funcion: '2024-08-07',
  hora_funcion: '15:30',
  _id: new ObjectId('66a743094989421734ea8e5f')
}
```

# Notas importantes

- Asegúrese de que todos los campos requeridos estén presentes en el objeto nuevoBoleto.
- El método crearBoleto1() es asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- Llame al método destructor() después de usar la instancia para liberar recursos.


# 2.2 Módulo de Gestión de Boletos - Búsqueda de Asientos Disponibles

Este módulo permite buscar asientos disponibles para una función específica utilizando la clase boleto. Debemos tener en cuenta que esta es la segunda parte del caso 2, que se enfoca en la busqueda de asientos disponibles segun una funcion en específico.

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

## Uso
El siguiente ejemplo muestra cómo buscar asientos disponibles para un horario de función específico:
```js
    let objBoleto = new boleto();

    const idHorarioFuncion = 1;

    const asientosDisponibles = await objBoleto.buscarAsientosDisponibles(idHorarioFuncion);
    console.log(asientosDisponibles);

    objBoleto.destructor()
```

## Funcionalidades
### Clase boleto

- buscarAsientosDisponibles(idHorarioFuncion): Método asíncrono que devuelve una lista de asientos disponibles para un horario de función específico.
- destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

### Parámetros

- idHorarioFuncion: Número entero que representa el ID único del horario de la función para la cual se buscan asientos disponibles.

## Ejemplo de salida
```js
Asientos disponibles:  [
  {
    _id: new ObjectId('66a3dc26280e8d342dd4144e'),
    id: 1,
    numero: 'A1',
    estado: 'disponible',
    tipo: 'preferencial'
  },
  {
    _id: new ObjectId('66a3dc26280e8d342dd41451'),
    id: 4,
    numero: 'A4',
    estado: 'disponible',
    tipo: 'preferencial'
  },
  {
    _id: new ObjectId('66a3dc26280e8d342dd41454'),
    id: 7,
    numero: 'A7',
    estado: 'disponible',
    tipo: 'preferencial'
  }
]
```

# Notas importantes

- El idHorarioFuncion debe ser un número entero válido correspondiente a una función existente.
- El método buscarAsientosDisponibles() es asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- La lista de asientos disponibles puede variar dependiendo de las reservas y compras realizadas.
- Asegúrese de llamar al método destructor() después de usar la instancia para liberar recursos.


# ___________________________________________________________________________________


# 3. Módulo de Gestión de Reservas 

# 3.1Creación de Reservas
Este módulo permite crear nuevas reservas de asientos para una función de cine específica utilizando la clase asiento. Este es un componente crucial del sistema de reservas que gestiona la creación de nuevas reservas con múltiples asientos. Debemos tener en cuenta que esta es la primer parte del tercer caso de uso, que seenfoca en la creacion de una reserva. 

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

## Uso
El siguiente ejemplo muestra cómo crear una nueva reserva con múltiples asientos:
```js
  let objAsiento = new asiento();

        const nuevaReserva = {
            id: 11,
            id_usuario: 2,
            fecha_reserva: '2024-07-20',
            estado: 'activa',
            expiracion: '2024-07-30',
            asientos: [4, 7, 10, 13],
            id_pelicula: 13,
            id_horario_funcion: 9
        };

        const reservaCreada = await objAsiento.crearReserva(nuevaReserva);
        console.log(reservaCreada)
    objAsiento.destructor();
```

# Funcionalidades
## Clase asiento

- crearReserva(nuevaReserva): Método asíncrono que crea una nueva reserva con los detalles proporcionados.
- destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

# Parámetros de nuevaReserva

id: Número entero que representa el ID único de la reserva.
id_usuario: Número entero que identifica al usuario que realiza la reserva.
fecha_reserva: Cadena de texto que representa la fecha de la reserva (formato 'YYYY-MM-DD').
estado: Cadena de texto que indica el estado actual de la reserva (ej. 'activa').
expiracion: Cadena de texto que representa la fecha de expiración de la reserva (formato 'YYYY-MM-DD').
asientos: Array de números enteros que representan los IDs de los asientos reservados.
id_pelicula: Número entero que identifica la película para la cual se hace la reserva.
id_horario_funcion: Número entero que identifica el horario específico de la función.


# Ejemplo de salida

```js
Reserva creada:  {
  id: 11,
  id_usuario: 2,
  fecha_reserva: '2024-07-20',
  estado: 'activa',
  expiracion: '2024-07-30',
  asientos: [ 4, 7, 10, 13 ],
  id_pelicula: 13,
  id_horario_funcion: 9,
  fecha_funcion: '2024-08-03',
  hora_funcion: '16:30',
  total: 88,
  _id: new ObjectId('66a781bd6eee31b24660c092')
}
```

# Notas importantes

- Todos los campos en nuevaReserva son obligatorios y deben proporcionarse con los tipos de datos correctos.
- El método crearReserva() es asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- Asegúrese de que los IDs de usuario, película, horario de función y asientos existan en el sistema antes de crear la reserva.
- El estado de la reserva debe ser válido según las reglas del sistema ('activa', 'cancelada', 'expirada').
- La fecha de expiración debe ser posterior a la fecha de reserva.
- Asegúrese de llamar al método destructor() después de usar la instancia para liberar recursos.



# 3.2 Módulo de Gestión de Reservas - Cancelación de Reservas
Este módulo permite cancelar reservas existentes utilizando la clase asiento. Esta funcionalidad es esencial para gestionar cambios en las reservas de los clientes y liberar asientos para otros usuarios. Debemos tener en cuenta que est aes la segunda parte del caso de uso 3, que se enfoca en la cancelacion de una reserva de asiento 

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

## Uso
El siguiente ejemplo muestra cómo cancelar una reserva existente:

```js
    let objAsiento = new asiento();

    const idReserva = 11;

    const reservaCancelada = await objAsiento.cancelarReserva(idReserva);
    console.log(reservaCancelada);
    objAsiento.destructor();
```
# Funcionalidades
## Clase asiento

cancelarReserva(idReserva): Método asíncrono que cancela una reserva existente basándose en su ID.
destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

## Parámetros

idReserva: Número entero que representa el ID único de la reserva que se desea cancelar.


# Ejemplo de salida

```js
{
  _id: new ObjectId('66a7839e8faace5095a50c33'),
  id: 11,
  id_usuario: 2,
  fecha_reserva: '2024-07-20',
  estado: 'cancelada',
  expiracion: '2024-07-30',
  asientos: [ 4, 7, 10, 13 ],
  id_pelicula: 13,
  id_horario_funcion: 9,
  fecha_funcion: '2024-08-03',
  hora_funcion: '16:30',
  total: 88
}
```
# Notas importantes

- El idReserva debe ser un número entero válido correspondiente a una reserva existente en el sistema.
- El método cancelarReserva() es asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- La cancelación de la reserva generalmente implica cambiar el estado de la reserva a 'cancelada' y liberar los asientos asociados.
- La implementación debe considerar las políticas de cancelación del sistema, como posibles penalizaciones o reembolsos.
- Asegúrese de llamar al método destructor() después de usar la instancia para liberar recursos.
- Después de la cancelación, los asientos asociados con esta reserva deberían volver a estar disponibles para nuevas reservas.



# ___________________________________________________________________________________

# 4. Descuentos y tarjetas VIP

# 4.1 Módulo de Descuentos y Creación de Boletos

Este módulo permite crear nuevos boletos para funciones de cine, aplicando descuentos si el usuario tiene una tarjeta VIP activa. Debemos tener en cuenta que es la primer parte del caso de uso 4, que se enfoca en la creacion de la boleta y aplicar su respectivo descuento.


Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso

```js
const nuevoBoleto = {
        id: 10,
        id_pelicula: 10,
        id_horario_funcion: 1,
        id_usuario: 3,
        id_reserva: null,
        asiento: "B4",
        tipo_compra: "virtual",
        fecha_compra: "2024-07-29",
        metodo_pago: "tarjeta de crédito",
        estado_compra: "realizado",
        total: 0 // (El valor total se calculará automáticamente)
      };

      let objDescuento = new descuento();

          const descuentoCreado = await objDescuento.descuentoBoleto(nuevoBoleto);
          console.log(descuentoCreado);


      objDescuento.destructor();
```

## Clase descuento
### Método descuentoBoleto(nuevoBoleto)
Este método crea un nuevo boleto, aplicando descuentos si corresponde.

## Parámetros

nuevoBoleto (Object): Un objeto con la siguiente estructura:

- id (Number): Identificador único del boleto.
- id_pelicula (Number): Identificador de la película.
- id_horario_funcion (Number): Identificador del horario de la función.
- id_usuario (Number): Identificador del usuario que compra el boleto.
- id_reserva (Number|null): Identificador de la reserva (si existe).
- asiento (String): Número o código del asiento.
- tipo_compra (String): Tipo de compra (ej. "virtual").
- fecha_compra (String): Fecha de compra en formato "YYYY-MM-DD".
- metodo_pago (String): Método de pago utilizado.
- estado_compra (String): Estado de la compra.
- total (Number): Precio total (se calculará automáticamente).



## Retorno

```js
{
  id: 10,
  id_pelicula: 10,
  id_horario_funcion: 1,
  id_usuario: 3,
  id_reserva: null,
  asiento: 'B4',
  tipo_compra: 'virtual',
  fecha_compra: '2024-07-29',
  metodo_pago: 'tarjeta de crédito',
  estado_compra: 'realizado',
  total: 150,
  fecha_funcion: '2024-07-30',
  hora_funcion: '18:00',
  _id: new ObjectId('66a868ef04d537599afcb2b5')
}
```




## Comportamiento

- Valida la existencia de la película, usuario y horario en la base de datos.
- Verifica si ya existe un boleto con los mismos datos.
- Calcula el precio del boleto, aplicando descuentos si el usuario tiene una tarjeta VIP activa.
- Guarda el nuevo boleto en la base de datos.

## Método destructor()
- Limpia las instancias y conexiones después de usar la clase.

# Notas Importantes

- El campo total del boleto se calcula automáticamente basándose en el precio de la función y los descuentos aplicables.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.




# 4.2 Módulo de Validación de Descuentos en Tarjeta VIP

Este módulo permite validar y aplicar descuentos para boletos de cine basados en la tarjeta VIP del usuario, si está disponible y activa. Debemos tener en cuenta que esta es la segunda parte del caso de uso 4, que se enfoca en la validacion de la tarjeta VIP.


Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso

```js
  const nuevoBoleto = {
    id: 11,
    id_pelicula: 10,
    id_horario_funcion: 1,
    id_usuario: 2,
    id_reserva: null,
    asiento: "B4",
    tipo_compra: "virtual",
    fecha_compra: "2024-07-29",
    metodo_pago: "tarjeta de crédito",
    estado_compra: "realizado",
    total: 0 // (El valor total se calculará automáticamente)
  };

  let objDescuento = new descuento();

      const descuentoCreado = await objDescuento.validacionDescuentoEnTarjeta(nuevoBoleto);
      console.log(descuentoCreado);


  objDescuento.destructor();
```

## Clase descuento
### Método validacionDescuentoEnTarjeta(nuevoBoleto)
Este método valida la elegibilidad para un descuento basado en la tarjeta VIP del usuario, aplica el descuento si corresponde, y crea un nuevo boleto en la base de datos.

### Parámetros

nuevoBoleto (Object): Un objeto con la siguiente estructura:

- id (Number): Identificador único del boleto.
- id_pelicula (Number): Identificador de la película.
- id_horario_funcion (Number): Identificador del horario de la función.
- id_usuario (Number): Identificador del usuario que compra el boleto.
- id_reserva (Number|null): Identificador de la reserva (si existe).
- asiento (String): Número o código del asiento.
- tipo_compra (String): Tipo de compra (ej. "virtual").
- fecha_compra (String): Fecha de compra en formato "YYYY-MM-DD".
- metodo_pago (String): Método de pago utilizado.
- estado_compra (String): Estado de la compra.
- total (Number): Precio total (se calculará automáticamente).



## Retorno

```js
{
  mensaje: 'Se aplicó el descuento y se guardó el boleto',
  boleto: {
    id: 11,
    id_pelicula: 10,
    id_horario_funcion: 1,
    id_usuario: 2,
    id_reserva: null,
    asiento: 'B4',
    tipo_compra: 'virtual',
    fecha_compra: '2024-07-29',
    metodo_pago: 'tarjeta de crédito',
    estado_compra: 'realizado',
    total: 120,
    fecha_funcion: '2024-07-30',
    hora_funcion: '18:00',
    _id: new ObjectId('66a86b7aecf3902443fc3d78')
  }
}
```



## Comportamiento

- Valida la existencia de la película, usuario y horario en la base de datos.
- Verifica si ya existe un boleto con los mismos datos.
- Comprueba si el usuario tiene una tarjeta VIP activa.
- Calcula el precio del boleto, aplicando descuentos si corresponde.
- Guarda el nuevo boleto en la base de datos.
- Retorna un mensaje indicando si se aplicó un descuento y los detalles del boleto creado.

### Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El campo total del boleto se calcula automáticamente basándose en el precio de la función y los descuentos aplicables.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.
- Este método no solo valida el descuento, sino que también crea el boleto en la base de datos.


# ___________________________________________________________________________________


# 5. Roles definidos

# 5.1 Módulo de Administración de Roles y Usuarios

Este módulo permite agregar nuevos usuarios al sistema, asignándoles roles específicos. Debemos tener en cuenta que esta es la primer parte del caso de uso 5, el cual hace enfasis en la creacion de nuevos usuarios

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso

```js
let objRol = new rol();
    
const datosUsuarioEstandar = {
    id: 51,
    nombre_completo: "Camilo DiazH",
    cc: "12999952567",
    alias: "camiloH",
    celular: "313236786)",
    email: "camiloH@email.com",
    telefono: "6983972699",
    rol: "Estandar"
};

console.log(await objRol.crearUsuario(datosUsuarioEstandar));

objRol.destructor();
```

## Clase rol
#### Método agregarUsuario(nuevoUsuario)
Este método agrega un nuevo usuario al sistema, validando sus datos y asignando el rol especificado.

## Parámetros

nuevoUsuario (Object): Un objeto con la siguiente estructura:

- id (Number): Identificador único del usuario.
- nombre (String): Nombre del usuario.
- apellido (String): Apellido del usuario.
- cc (Number): Número de identificación o cédula del usuario.
- alias (String): Alias o nombre de usuario.
- rol (String): Rol asignado al usuario (ej. "VIP").
- email (String): Correo electrónico del usuario.
- celular (Number): Número de teléfono celular del usuario.


## Retorno

```js
{
  id: 19,
  nombre: 'Neil',
  apellido: 'Gutierrez',
  cc: 1247263459,
  alias: 'NeilGG',
  rol: 'VIP',
  email: 'neil.guti@example.com',
  celular: 314569721,
  _id: new ObjectId('66a882b9ca61a2e681bb322f')
}
```


## Comportamiento

- Valida que todos los campos requeridos del usuario estén presentes y sean válidos.
- Verifica si ya existe un usuario con el mismo ID, correo electrónico o número de cédula.
- Asigna el rol especificado al usuario.
- Agrega el nuevo usuario a la base de datos.
- Retorna un mensaje de confirmación junto con los detalles del usuario agregado.

## Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El rol especificado debe ser válido según los roles definidos en el sistema.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.



# 5.2 Módulo de Búsqueda de Usuarios

Este módulo permite buscar usuarios en el sistema por su ID. Debemos tener en cuenta que esta es la segunda parte del caso de uso 5, que se enfoca en la busqueda de un usuari por su id, teniendo een cuenta el estado de su tarjeta.

Este caso de uso es aplicable a un solo tipo de usuarios, incluyendo Administradores. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un usuario específico, es importante destacar que esta funcionalidad no está limitada a ese único usuario.


# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```


### Uso

```js
let objRol = new rol();

const idUsuario = 2; 
const usuarioEncontrado = await objRol.buscarUsuarioPorId(idUsuario);
console.log(usuarioEncontrado);

objRol.destructor();
```

## Clase rol
### Método buscarUsuarioPorId(idUsuario)
Este método busca y retorna la información de un usuario específico basado en su ID.

## Parámetros

idUsuario (Number): El identificador único del usuario que se desea buscar.

# Retorno

```js
{
  _id: new ObjectId('66a46a3e280e8d342dd414d1'),
  id: 2,
  nombre: 'María',
  apellido: 'Martínez',
  cc: 987654321,
  alias: 'mari',
  rol: 'VIP',
  email: 'maria.martinez@example.com',
  celular: 3109876543,
  tarjeta_vip: {
    numero_tarjeta: 1002003001,
    descuento: 20,
    fecha_expiracion: '2025-12-31',
    estado: 'activa'
  }
}
```

## Comportamiento

- Busca en la base de datos un usuario que coincida con el ID proporcionado.
- Si se encuentra el usuario, retorna toda su información.
- Si no se encuentra el usuario, retorna null o un mensaje indicando que no se encontró.
- Si ocurre algún error durante la búsqueda, retorna un mensaje de error.

### Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El ID del usuario debe ser un número válido.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.



# 5.3 Módulo de Actualización de Roles de Usuario

Este módulo permite cambiar el rol de un usuario existente en el sistema. Debemos tener en cuenta que esta es la tercer parte del caso de uso 5, que se enfoca en la actualizacion del rol de un usuario

Este caso de uso es aplicable a un solo tipo de usuarios, incluyendo Administradores. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un usuario específico, es importante destacar que esta funcionalidad no está limitada a ese único usuario.


# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```


### Uso

```js
let objRol = new rol();

    const datosActualizados1 = {
        id: 48,
        rol: 'Estandar'
    };
    console.log(await objRol.cambiarRolUsuario(datosActualizados1));

objRol.destructor();
```

## Rol.destructor();

# Clase rol
### Método cambiarRolUsuario(idUsuario, nuevoRol)
Este método actualiza el rol de un usuario específico basado en su ID.

## Parámetros

- idUsuario (Number): El identificador único del usuario cuyo rol se desea cambiar.
- nuevoRol (String): El nuevo rol que se asignará al usuario.

# Retorno

```js
{
  _id: new ObjectId('66a46a3e280e8d342dd414d2'),
  id: 3,
  nombre: 'Juan',
  apellido: 'Pérez',
  cc: 112233445,
  alias: 'juancho',
  rol: 'VIP',
  email: 'juan.perez@example.com',
  celular: 3201122334
}
```


## Comportamiento

- Busca en la base de datos un usuario que coincida con el ID proporcionado.
- Si se encuentra el usuario, actualiza su rol con el nuevo valor proporcionado.
- Retorna la información actualizada del usuario.
- Si no se encuentra el usuario, retorna un mensaje indicando que no se encontró.
- Si ocurre algún error durante la actualización, retorna un mensaje de error.

## Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El ID del usuario debe ser un número válido.
- El nuevo rol debe ser una cadena de texto válida y corresponder a uno de los roles permitidos en el sistema.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.


# 5.4 Módulo de Búsqueda de Usuarios por Rol

Este módulo permite buscar y listar todos los usuarios que tienen un rol específico en el sistema. Debemos tener en cuenta que esta es la parte 4 del caso de uso 5, que se enfoca en filtrar los usuarios por su rol

Este caso de uso es aplicable a un solo tipo de usuarios, incluyendo Administradores. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un usuario específico, es importante destacar que esta funcionalidad no está limitada a ese único usuario.


# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```


### Uso

```js
    let objRol = new rol();

        const rolBuscado = 'VIP'; 
        const usuariosPorRol = await objRol.buscarUsuariosPorRol(rolBuscado);
        console.log(usuariosPorRol);
    objRol.destructor();
```

## Clase rol
### Método buscarUsuariosPorRol(rolBuscado)
Este método busca y retorna una lista de todos los usuarios que tienen el rol especificado.

## Parámetros

- rolBuscado (String): El rol por el cual se desea filtrar los usuarios.

# Retorno

```js
[
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d1'),
    id: 2,
    nombre: 'María',
    apellido: 'Martínez',
    cc: 987654321,
    alias: 'mari',
    rol: 'VIP',
    email: 'maria.martinez@example.com',
    celular: 3109876543
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d3'),
    id: 4,
    nombre: 'Ana',
    apellido: 'López',
    cc: 556677889,
    alias: 'anita',
    rol: 'VIP',
    email: 'ana.lopez@example.com',
    celular: 3115566778
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d5'),
    id: 6,
    nombre: 'Sofía',
    apellido: 'Hernández',
    cc: 667788990,
    alias: 'sofi',
    rol: 'VIP',
    email: 'sofia.hernandez@example.com',
    celular: 3106677889
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d7'),
    id: 8,
    nombre: 'Laura',
    apellido: 'Ramírez',
    cc: 778899001,
    alias: 'lau',
    rol: 'VIP',
    email: 'laura.ramirez@example.com',
    celular: 3137788990
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d8'),
    id: 9,
    nombre: 'David',
    apellido: 'Flores',
    cc: 445566778,
    alias: 'dave',
    rol: 'VIP',
    email: 'david.flores@example.com',
    celular: 3204455667
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414d9'),
    id: 10,
    nombre: 'Isabel',
    apellido: 'Ríos',
    cc: 889900112,
    alias: 'isa',
    rol: 'VIP',
    email: 'isabel.rios@example.com',
    celular: 3108899001
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414db'),
    id: 12,
    nombre: 'Patricia',
    apellido: 'Gómez',
    cc: 667788990,
    alias: 'pati',
    rol: 'VIP',
    email: 'patricia.gomez@example.com',
    celular: 3126677889
  },
  {
    _id: new ObjectId('66a46a3e280e8d342dd414dd'),
    id: 14,
    nombre: 'Fernanda',
    apellido: 'Suárez',
    cc: 889900112,
    alias: 'fer',
    rol: 'VIP',
    email: 'fernanda.suarez@example.com',
    celular: 3148899001
  }
]
```


### Comportamiento

- Busca en la base de datos todos los usuarios que tienen el rol especificado.
- Retorna un array con la información de todos los usuarios encontrados.
- Si no se encuentran usuarios con ese rol, retorna un array vacío.
- Si ocurre algún error durante la búsqueda, retorna un mensaje de error.

## Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El rol buscado debe ser una cadena de texto válida y corresponder a uno de los roles existentes en el sistema.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.
- Este método puede retornar un gran número de resultados si hay muchos usuarios con el rol especificado.


# ___________________________________________________________________________________

# 6. Compras en Linea

#  6.1 Módulo de Compra de Boletos

Este módulo permite realizar la compra de boletos para funciones de cine, procesando el pago y registrando la transacción en el sistema. Debemos tener en cuenta que esta es la primer pate del caso de uso 6

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso

```js
const nuevoBoleto = {
    id: 12,
    id_pelicula: 16,
    id_horario_funcion: 6,
    id_usuario: 7,
    id_reserva: null,
    asiento: "C9",
    tipo_compra: "virtual",
    fecha_compra: "2024-07-30",
    metodo_pago: "tarjeta de crédito",
    estado_compra: "realizado",
    total: 0 
};

let objPago = new pago();

    const boletoCreado = await objPago.compraBoleto(nuevoBoleto);
    console.log(boletoCreado);

objPago.destructor();
```

## Clase pago

### Método compraBoleto(nuevoBoleto)
Este método procesa la compra de un boleto, realiza las validaciones necesarias, calcula el total a pagar y registra la transacción en el sistema.

## Parámetros

nuevoBoleto (Object): Un objeto con la siguiente estructura:

- id (Number): Identificador único del boleto.
- id_pelicula (Number): Identificador de la película.
- id_horario_funcion (Number): Identificador del horario de la función.
- id_usuario (Number): Identificador del usuario que compra el boleto.
- id_reserva (Number|null): Identificador de la reserva (si existe).
- asiento (String): Número o código del asiento.
- tipo_compra (String): Tipo de compra (ej. "virtual").
- fecha_compra (String): Fecha de compra en formato "YYYY-MM-DD".
- metodo_pago (String): Método de pago utilizado.
- estado_compra (String): Estado de la compra.
- total (Number): Precio total (se calculará automáticamente).



Retorno

```js
{
  mensaje: 'COMPRA DE BOLETO REALIZADA CON ÉXITO',
  boleto: {
    id: 12,
    id_pelicula: 16,
    id_horario_funcion: 6,
    id_usuario: 7,
    id_reserva: null,
    asiento: 'C9',
    tipo_compra: 'virtual',
    fecha_compra: '2024-07-30',
    metodo_pago: 'tarjeta de crédito',
    estado_compra: 'realizado',
    total: 170,
    fecha_funcion: '2024-08-01',
    hora_funcion: '21:00',
    _id: new ObjectId('66a88eeca2a06494a5003c81')
  }
}
```


## Comportamiento

- Valida la existencia de la película, horario de función y usuario en la base de datos.
- Verifica la disponibilidad del asiento seleccionado.
- Calcula el precio total del boleto, aplicando descuentos si corresponde (ej. usuario VIP).
- Procesa el pago utilizando el método de pago especificado.
- Registra la compra del boleto en la base de datos.
- Actualiza la disponibilidad del asiento.
- Retorna el boleto creado con toda la información actualizada.

## Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El campo total del boleto se calcula automáticamente basándose en el precio de la función y los descuentos aplicables.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.
- Este método realiza múltiples operaciones en la base de datos, por lo que es crucial manejar correctamente las transacciones para asegurar la integridad de los datos.



#  6.2 Módulo de Compra de Boletos con detalles del boleto

Este módulo permite realizar la compra de boletos para funciones de cine, procesando el pago y registrando la transacción en el sistema. Debemos tener en cuenta que esta es la segunda pate del caso de uso 6

Este caso de uso es aplicable a diversos tipos de usuarios, incluyendo Administradores, Usuarios Estándar y VIP. Aunque los ejemplos que se presentan a continuación se centran en un usuario con un rol específico, es importante destacar que esta funcionalidad no está limitada a ese único rol.

# Usuarios de prueba:

## USUARIO ADMINISTRADOR

user: "mariiangel",  pwd: "345678901"

```javascript
mongodb://mariiangel:345678901@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO VIP

user: "pati",  pwd: "667788990"

```javascript
mongodb://pati:667788990@roundhouse.proxy.rlwy.net:48985/cineCampus
```



# USUARIO ESTANDAR

user: "dave",  pwd: "445566778"

```javascript
mongodb://dave:445566778@roundhouse.proxy.rlwy.net:48985/cineCampus
```

### Uso

```js
const nuevoBoleto = {
    id: 13,
    id_pelicula: 6,
    id_horario_funcion: 11,
    id_usuario: 9,
    id_reserva: null,
    asiento: "E3",
    tipo_compra: "presencial",
    fecha_compra: "2024-07-30",
    metodo_pago: "Efectivo",
    estado_compra: "realizado",
    total: 0 
};

let objPago = new pago();

    const boletoCreado = await objPago.compraBoletoDetalle(nuevoBoleto);
    console.log(boletoCreado);

objPago.destructor();
```

## Clase pago

### Método compraBoletoDetalle(nuevoBoleto)
Este método procesa la compra de un boleto, realiza las validaciones necesarias, calcula el total a pagar y registra la transacción en el sistema.

## Parámetros

nuevoBoleto (Object): Un objeto con la siguiente estructura:

- id (Number): Identificador único del boleto.
- id_pelicula (Number): Identificador de la película.
- id_horario_funcion (Number): Identificador del horario de la función.
- id_usuario (Number): Identificador del usuario que compra el boleto.
- id_reserva (Number|null): Identificador de la reserva (si existe).
- asiento (String): Número o código del asiento.
- tipo_compra (String): Tipo de compra (ej. "virtual").
- fecha_compra (String): Fecha de compra en formato "YYYY-MM-DD".
- metodo_pago (String): Método de pago utilizado.
- estado_compra (String): Estado de la compra.
- total (Number): Precio total (se calculará automáticamente).



Retorno

```js
{
  mensaje: 'Compra realizada exitosamente, Estos son los detalles de su boleto: ',
  boleto: {
    id: 13,
    id_pelicula: 6,
    id_horario_funcion: 11,
    id_usuario: 9,
    id_reserva: null,
    asiento: 'E3',
    tipo_compra: 'presencial',
    fecha_compra: '2024-07-30',
    metodo_pago: 'Efectivo',
    estado_compra: 'realizado',
    total: 125,
    fecha_funcion: '2024-08-04',
    hora_funcion: '14:00',
    _id: new ObjectId('66a88ea6bba796276c31f616')
  }
}
```


## Comportamiento

- Valida la existencia de la película, horario de función y usuario en la base de datos.
- Verifica la disponibilidad del asiento seleccionado.
- Calcula el precio total del boleto, aplicando descuentos si corresponde (ej. usuario VIP).
- Procesa el pago utilizando el método de pago especificado.
- Registra la compra del boleto en la base de datos.
- Actualiza la disponibilidad del asiento.
- Retorna el boleto creado con toda la información actualizada.

## Método destructor()
Limpia las instancias y conexiones después de usar la clase.


# Notas Importantes

- El campo total del boleto se calcula automáticamente basándose en el precio de la función y los descuentos aplicables.
- Es importante llamar al método destructor() después de utilizar la clase para liberar recursos.
- Este método realiza múltiples operaciones en la base de datos, por lo que es crucial manejar correctamente las transacciones para asegurar la integridad de los datos.