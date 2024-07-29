import {pelicula} from './js/modules/pelicula.js'
import {boleto} from './js/modules/boleto.js'


// 1. Seleccion de peliculas


// Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.

    // let objPelicula = new pelicula();

    // console.log(`Peliculas disponibles: `, await objPelicula.getPeliculas());

    // objPelicula.destructor();


// Permitir la consulta de información detallada sobre una película específica, incluyendo sinopsis.

    // const idPeliculaById = 2; 

    //     let objPelicula = new pelicula();

    //     console.log(`Información de la película con ID ${idPeliculaById}: `, await objPelicula.getPeliculaById(idPeliculaById));

    //     objPelicula.destructor();



/* ----------------------------------------------------------------------------------------------------------------- */


// 2. Compra de boletos

// Permitir la compra de boletos para una película específica, incluyendo la selección de la fecha y la hora de la proyección.

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
