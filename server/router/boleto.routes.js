const express = require('express');
const router = express.Router();
const {crearBoleto, 
    buscarAsientosDisponibles, 
    informacionHorarios, 
    compraRealizacion} = require("../controllers/boletoControllers");

router.post('/boletos', crearBoleto);
router.get('/boletos/asientos/:idHorarioFuncion', buscarAsientosDisponibles);
router.get('/boletos/horarios/:idPelicula', informacionHorarios);
router.post('/boletos/confirmacion-ticket', compraRealizacion);

module.exports = router;