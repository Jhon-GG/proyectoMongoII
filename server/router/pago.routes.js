const express = require('express');
const { body, validationResult } = require('express-validator');
const Pago = require('../modules/pago');

const router = express.Router();

router.post('/comprar-boleto', [
    body('id').notEmpty().isString(),
    body('id_pelicula').notEmpty().isString(),
    body('id_horario_funcion').notEmpty().isString(),
    body('id_usuario').notEmpty().isString(),
    body('asiento').notEmpty().isString(),
    body('tipo_compra').notEmpty().isString(),
    body('metodo_pago').notEmpty().isString(),
    body('estado_compra').notEmpty().isString(),
    body('id_reserva').optional().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let obj = new Pago();
    res.send(await obj.compraBoleto(req.body));
});

router.post('/comprar-boleto-detalle', [
    body('id').notEmpty().isString(),
    body('id_pelicula').notEmpty().isString(),
    body('id_horario_funcion').notEmpty().isString(),
    body('id_usuario').notEmpty().isString(),
    body('asiento').notEmpty().isString(),
    body('tipo_compra').notEmpty().isString(),
    body('metodo_pago').notEmpty().isString(),
    body('estado_compra').notEmpty().isString(),
    body('id_reserva').optional().isString()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let obj = new Pago();
    res.send(await obj.compraBoletoDetalle(req.body));
});

module.exports = router;