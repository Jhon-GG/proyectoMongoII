

const express = require('express');
const router = express.Router();
const Asiento = require('../modules/asiento.js');

// Instancia de la clase Asiento
const asientoInstance = new Asiento();

// Ruta para crear una reserva
router.post('/reserva', async (req, res) => {
    try {
        const resultado = await asientoInstance.crearReserva(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para cancelar una reserva
router.put('/cancelar/:id', async (req, res) => {
    try {
        const resultado = await asientoInstance.cancelarReserva(req.params.id);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;