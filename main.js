import {pelicula} from './js/modules/pelicula.js'

let objPelicula = new pelicula();

console.log(`Peliculas disponibles: `, await objPelicula.getPeliculas());

objPelicula.destructor();