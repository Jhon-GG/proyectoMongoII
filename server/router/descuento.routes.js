

const express = require('express');
const router = express.Router();
const Descuento = require('../modules/descuento.js');

// Instancia de la clase Descuento
const descuentoInstance = new Descuento();

// Ruta para aplicar descuento al boleto
router.post('/aplicar-descuento', async (req, res) => {
    try {
        const resultado = await descuentoInstance.descuentoBoleto(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ruta para validar descuento en tarjeta y crear boleto
router.post('/validar-descuento', async (req, res) => {
    try {
        const resultado = await descuentoInstance.validacionDescuentoEnTarjeta(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;