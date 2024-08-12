const express = require('express');
const { query, body, validationResult } = require('express-validator');
const Boleto = require('../modules/boleto');

const router = express.Router();

router.get('/disponibilidad', [
    query('idHorarioFuncion').notEmpty().isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let obj = new Boleto();
    res.send(await obj.buscarAsientosDisponibles(parseInt(req.query.idHorarioFuncion)));
});

router.post('/crear', [
    body('id').notEmpty().isString(),
    body('id_pelicula').notEmpty().isString(),
    body('id_horario_funcion').notEmpty().isString(),
    body('id_usuario').notEmpty().isString(),
    body('id_reserva').optional().isString(),
    body('asiento').notEmpty().isString(),
    body('tipo_compra').notEmpty().isIn(['online', 'offline']),
    body('metodo_pago').notEmpty(),
    body('estado_compra').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let obj = new Boleto();
    res.send(await obj.crearBoleto1(req.body));
});

module.exports = router;