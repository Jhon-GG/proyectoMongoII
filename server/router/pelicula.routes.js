const { ObjectId } = require('mongodb');
const { query, body, param, validationResult } = require('express-validator');
const pelicula = require('../module/pelicula');
const express = require('express');
const appPelicula = express.Router();


appPelicula.get('/', async (req, res) => {
    let obj = new pelicula();
    res.send(await obj.getPeliculas());
});


appPelicula.get('/details', [query('id').notEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Envíe el ID de a pelicula que desea buscar" });
    
    let obj = new pelicula();
    res.send(await obj.obtenerDetallesPelicula(req.query.id_titulo));
});

appPelicula.get('/por-estado', [query('estado').notEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: "Envíe el estado de la película" });
    
    let obj = new pelicula();
    res.send(await obj.obtenerPeliculasPorEstado({ estado: req.query.estado }));
});

module.exports = appPelicula;