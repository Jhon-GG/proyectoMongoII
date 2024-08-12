const express = require('express');
const { body, validationResult } = require('express-validator');
const Asiento = require('../modules/asiento');
const appAsiento = express.Router();

appAsiento.post('/crear', [
    body('id').notEmpty().isString(),
    body('id_pelicula').notEmpty().isString(),
    body('id_horario_funcion').notEmpty().isString(),
    body('id_usuario').notEmpty().isString(),
    body('asientos').isArray(),
    body('fecha_reserva').optional().isString(),
    body('estado').optional().isString(),
    body('expiracion').optional().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let obj = new Asiento();
    const resultado = await obj.crearReserva(req.body);
    res.json(resultado);
});

appAsiento.put('/cancelar/:idReserva', [
    body('id_usuario').notEmpty().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { idReserva } = req.params;
    let obj = new Asiento();
    const resultado = await obj.cancelarReserva(idReserva);
    res.json(resultado);
});

module.exports = appAsiento;