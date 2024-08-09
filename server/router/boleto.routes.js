
const express = require('express');
const router = express.Router();
const Boleto = require('../modules/boleto');

// Instancia de la clase Boleto
const boletoInstance = new Boleto();

// Ruta para crear un nuevo boleto
router.post('/crear', async (req, res) => {
    try {
        const resultado = await boletoInstance.crearBoleto1(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para buscar asientos disponibles
router.get('/asientos-disponibles/:idHorarioFuncion', async (req, res) => {
    try {
        const asientos = await boletoInstance.buscarAsientosDisponibles(req.params.idHorarioFuncion);
        res.json(asientos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;