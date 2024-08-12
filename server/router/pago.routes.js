

const express = require('express');
const router = express.Router();
const Pago = require('../modules/pago');

// Instancia de la clase Pago
const pagoInstance = new Pago();

// Ruta para comprar un boleto
router.post('/comprar-boleto', async (req, res) => {
    try {
        const resultado = await pagoInstance.compraBoleto(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para comprar un boleto y obtener detalles
router.post('/comprar-boleto-detalle', async (req, res) => {
    try {
        const resultado = await pagoInstance.compraBoletoDetalle(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;