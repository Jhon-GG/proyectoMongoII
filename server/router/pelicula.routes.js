const express = require('express');
const router = express.Router();
const { listarPeliculas, obtenerDetallesPelicula, obtenerPeliculasPorEstado } = require("../controllers/peliculaControllers");

router.get('/peliculas', listarPeliculas);
router.get('/peliculas/:idOTitulo', obtenerDetallesPelicula);
router.get('/peliculas/estado/:estado', obtenerPeliculasPorEstado);

module.exports = router;