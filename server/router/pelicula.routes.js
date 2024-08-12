// server/router/pelicula.routes.js

const express = require('express');
const { ObjectId } = require("mongodb");
const Pelicula = require('../modules/pelicula');

const router = express.Router();

// Obtener todas las películas
router.get('/v1', async (req, res) => {
    try {
        const peliculaInstance = new Pelicula();
        const peliculas = await peliculaInstance.getPeliculas();
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las películas", error: error.message });
    }
});

// Obtener película por ID
router.get('/v2/:id', async (req, res) => {
    try {
        const peliculaInstance = new Pelicula();
        const pelicula = await peliculaInstance.getPeliculaById(req.params.id);
        if (pelicula.mensaje) {
            return res.status(404).json(pelicula);
        }
        res.json(pelicula);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la película", error: error.message });
    }
});

// Obtener películas por estado
router.get('/v3/:estado', async (req, res) => {
    try {
        const peliculaInstance = new Pelicula();
        const peliculas = await peliculaInstance.getPeliculaByEstado(req.params.estado);
        if (peliculas.error) {
            return res.status(404).json(peliculas);
        }
        res.json(peliculas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las películas por estado", error: error.message });
    }
});

module.exports = router;