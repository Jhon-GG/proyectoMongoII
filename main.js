import {pelicula} from './js/modules/pelicula.js'


// 1. Seleccion de peliculas


// Permitir la consulta de todas las películas disponibles en el catálogo, con detalles como título, género, duración y horarios de proyección.
let objPelicula = new pelicula();

console.log(`Peliculas disponibles: `, await objPelicula.getPeliculas());

objPelicula.destructor();

