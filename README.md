### Proyecto: CineCampus

#### Problemtica

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


## Módulo de Gestión de Películas
Este módulo proporciona funcionalidades para manejar y obtener información sobre películas disponibles en nuestro sistema. Debemos tener en cuenta que este caso de uso tiene dos partes, esta primera parte se encarga de traer todas las peliculas disponibles.
### Uso:
El siguiente ejemplo muestra cómo utilizar la clase pelicula para obtener la lista de películas disponibles:

```js
let objPelicula = new pelicula();
console.log(`Peliculas disponibles: `, await objPelicula.getPeliculas());
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



## Módulo de Gestión de Películas - Búsqueda por ID
Este módulo permite obtener información detallada de una película específica utilizando su ID. Debemos tener en cuenta que este caso de uso tiene dos partes, esta segunda parte se encarga de traer la pelicula que elijamos segun su id, mostrando informacion específica de la misma.
### Uso
El siguiente ejemplo muestra cómo utilizar la clase pelicula para obtener información de una película por su ID:
```js
const idPeliculaById = 2; 
let objPelicula = new pelicula();

console.log(`Información de la película con ID ${idPeliculaById}: `, 
            await objPelicula.getPeliculaById(idPeliculaById));

objPelicula.destructor();
```
## Funcionalidades
### Clase pelicula

getPeliculaById(id): Método asíncrono que devuelve la información de una película específica basada en su ID.
destructor(): Método para liberar recursos cuando ya no se necesita la instancia.

# Ejemplo de salida

```js
Información de la película con ID 2:  [
  {
    id: 2,
    titulo: 'Observados',
    genero: 'Thriller / Suspenso',
    duracion: '1h 50m',
    estado: 'En cartelera',
    sinopsis: 'Un grupo de amigos descubre que están siendo vigilados por una entidad desconocida.',
    estreno: '2024-07-10',
    director: 'David F. Sandberg',
    horarios_funcion: [ [Object], [Object] ]
  }
]
```
# Notas importantes

- El parámetro idPeliculaById debe ser un número entero válido correspondiente al ID de una película existente.
- getPeliculaById() es un método asíncrono, por lo que debe usarse con await o manejarse como una promesa.
- Asegúrese de llamar al método destructor() después de usar la instancia para liberar recursos.


# ___________________________________________________________________________________


# 2. Compra de Boletos:


**API para Comprar Boletos:** Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

**API para Verificar Disponibilidad de Asientos:** Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

## Módulo de Gestión de Boletos - Creación de Boletos
Este módulo permite la creación de nuevos boletos para funciones de cine utilizando la clase boleto. Debemos tener en cuenta que esta es la primer parte del caso 2, que se enfoca en la compra de un nuevo boleto.

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
          console.log(`Boleto creado: `, boletoCreado);

  
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


## Módulo de Gestión de Boletos - Búsqueda de Asientos Disponibles

Este módulo permite buscar asientos disponibles para una función específica utilizando la clase boleto. Debemos tener en cuenta que esta es la segunda parte del caso 2, que se enfoca en la busqueda de asientos disponibles segun una funcion en específico.

## Uso
El siguiente ejemplo muestra cómo buscar asientos disponibles para un horario de función específico:
```js
    let objBoleto = new boleto();

    const idHorarioFuncion = 1;

    const asientosDisponibles = await objBoleto.buscarAsientosDisponibles(idHorarioFuncion);
    console.log(`Asientos disponibles: `, asientosDisponibles);

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


# 3. Módulo de Gestión de Asientos - Creación de Reservas
Este módulo permite crear nuevas reservas de asientos para funciones de cine utilizando la clase asiento. Debemos tener en cuenat que esta es la primer parte de la consulta tres, que va enfocada a la realizacion de una reserva

## Uso
El siguiente ejemplo muestra cómo crear una nueva reserva:
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
        console.log(`Reserva creada: `, reservaCreada)
        objAsiento.destructor();
```
