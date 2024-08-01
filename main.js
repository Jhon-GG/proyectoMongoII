import {pelicula} from './js/modules/pelicula.js'
import {boleto} from './js/modules/boleto.js'
import { asiento } from './js/modules/asiento.js'
import { descuento } from './js/modules/descuento.js';
import {rol} from './js/modules/rol.js'
import {pago} from './js/modules/pago.js'


// 1. Seleccion de peliculas


// Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.

    // let objPelicula = new pelicula();

    // console.log(`Peliculas disponibles: `, await objPelicula.getPeliculas());

    // objPelicula.destructor();


// Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.

    // const idPeliculaById = 2;

    //     let objPelicula = new pelicula();

    //     console.log(await objPelicula.getPeliculaById(idPeliculaById));

    //     objPelicula.destructor();



/* ----------------------------------------------------------------------------------------------------------------- */


// 2. Compra de boletos

// Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

// const nuevoBoleto = {
//     id: 9,
//     id_pelicula: 2,
//     id_horario_funcion: 3,
//     id_usuario: 2,
//     id_reserva: null,
//     asiento: "A1",
//     tipo_compra: "virtual",
//     fecha_compra: "2024-07-21",
//     metodo_pago: "tarjeta de crédito",
//     estado_compra: "realizado",
//     total: 0
//   };

//   let objBoleto = new boleto();

//       const boletoCreado = await objBoleto.crearBoleto1(nuevoBoleto);
//       console.log(boletoCreado);


//   objBoleto.destructor();



// Permitir la consulta de la disponibilidad de asientos en una sala para una proyección específica.

    // let objBoleto = new boleto();

    // const idHorarioFuncion = 1;

    // const asientosDisponibles = await objBoleto.buscarAsientosDisponibles(idHorarioFuncion);
    // console.log(asientosDisponibles);

    // objBoleto.destructor()



/* ----------------------------------------------------------------------------------------------------------------- */

// 3. Asignación de asientos

// Permitir la selección y reserva de asientos para una proyección específica.

    // let objAsiento = new asiento();

    //     const nuevaReserva = {
    //         id: 11,
    //         id_usuario: 2,
    //         fecha_reserva: '2024-07-20',
    //         estado: 'activa',
    //         expiracion: '2024-07-30',
    //         asientos: [4, 7, 10, 13],
    //         id_pelicula: 13,
    //         id_horario_funcion: 9
    //     };

    //     const reservaCreada = await objAsiento.crearReserva(nuevaReserva);
    //     console.log(reservaCreada)
    // objAsiento.destructor();


// Permitir la cancelación de una reserva de asiento ya realizada.

    // let objAsiento = new asiento();

    // const idReserva = 11;

    // const reservaCancelada = await objAsiento.cancelarReserva(idReserva);
    // console.log(reservaCancelada);
    // objAsiento.destructor();



/* ----------------------------------------------------------------------------------------------------------------- */


// 4. Descuentos y tarjetas VIP

// Permitir la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP.

    // const nuevoBoleto = {
    //     id: 10,
    //     id_pelicula: 10,
    //     id_horario_funcion: 1,
    //     id_usuario: 3,
    //     id_reserva: null,
    //     asiento: "B4",
    //     tipo_compra: "virtual",
    //     fecha_compra: "2024-07-29",
    //     metodo_pago: "tarjeta de crédito",
    //     estado_compra: "realizado",
    //     total: 0 // (El valor total se calculará automáticamente)
    //   };

    //   let objDescuento = new descuento();

    //       const descuentoCreado = await objDescuento.descuentoBoleto(nuevoBoleto);
    //       console.log(descuentoCreado);


    //   objDescuento.destructor();



// Permitir la verificación de la validez de una tarjeta VIP durante el proceso de compra.


//   const nuevoBoleto = {
//     id: 11,
//     id_pelicula: 10,
//     id_horario_funcion: 1,
//     id_usuario: 2,
//     id_reserva: null,
//     asiento: "B4",
//     tipo_compra: "virtual",
//     fecha_compra: "2024-07-29",
//     metodo_pago: "tarjeta de crédito",
//     estado_compra: "realizado",
//     total: 0 // (El valor total se calculará automáticamente)
//   };

//   let objDescuento = new descuento();

//       const descuentoCreado = await objDescuento.validacionDescuentoEnTarjeta(nuevoBoleto);
//       console.log(descuentoCreado);


//   objDescuento.destructor();



/* ----------------------------------------------------------------------------------------------------------------- */


// 5. Roles definidos

// Permitir la creación de nuevos usuarios en el sistema, asignando roles y privilegios específicos (usuario estándar, usuario VIP o administrador).

let objRol = new rol();
    
const datosUsuarioEstandar = {
    id: 49,
    nombre_completo: "Andrea Pabon",
    cc: "1295437873",
    alias: "andre",
    celular: "3132349666",
    email: "andre.pabon@email.com",
    telefono: "6983988592",
    rol: "VIP"
};

console.log(await objRol.crearUsuario(datosUsuarioEstandar));

objRol.destructor();



// Permitir la consulta de información detallada sobre un usuario, incluyendo su rol y estado de tarjeta VIP.


// let objRol = new rol();

// const idUsuario = 2; 
// const usuarioEncontrado = await objRol.buscarUsuarioPorId(idUsuario);
// console.log(usuarioEncontrado);

// objRol.destructor();



// Permitir la actualización del rol de un usuario (por ejemplo, cambiar de usuario estándar a VIP, o viceversa).


    // let objRol = new rol();

    //     const idUsuario = 3;
    //     const nuevoRol = 'VIP'; 
    //     const usuarioActualizado = await objRol.cambiarRolUsuario(idUsuario, nuevoRol);
    //     console.log(usuarioActualizado);

    // objRol.destructor();



// Permitir la consulta de todos los usuarios del sistema, con la posibilidad de filtrar por rol (VIP, estándar o administrador).


    // let objRol = new rol();

    //     const rolBuscado = 'VIP'; 
    //     const usuariosPorRol = await objRol.buscarUsuariosPorRol(rolBuscado);
    //     console.log(usuariosPorRol);
    // objRol.destructor();



/* ----------------------------------------------------------------------------------------------------------------- */

// 6. Compras en linea


// Permitir el procesamiento de pagos en línea para la compra de boletos.

// const nuevoBoleto = {
//     id: 12,
//     id_pelicula: 16,
//     id_horario_funcion: 6,
//     id_usuario: 7,
//     id_reserva: null,
//     asiento: "C9",
//     tipo_compra: "virtual",
//     fecha_compra: "2024-07-30",
//     metodo_pago: "tarjeta de crédito",
//     estado_compra: "realizado",
//     total: 0 
// };

// let objPago = new pago();

//     const boletoCreado = await objPago.compraBoleto(nuevoBoleto);
//     console.log(boletoCreado);

// objPago.destructor();


// Enviar confirmación de la compra y los detalles del boleto al usuario.


// const nuevoBoleto = {
//     id: 13,
//     id_pelicula: 6,
//     id_horario_funcion: 11,
//     id_usuario: 9,
//     id_reserva: null,
//     asiento: "E3",
//     tipo_compra: "presencial",
//     fecha_compra: "2024-07-30",
//     metodo_pago: "Efectivo",
//     estado_compra: "realizado",
//     total: 0 
// };

// let objPago = new pago();

//     const boletoCreado = await objPago.compraBoletoDetalle(nuevoBoleto);
//     console.log(boletoCreado);

// objPago.destructor();