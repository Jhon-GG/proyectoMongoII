const express = require('express');
const router = express.Router();
const {crearBoleto, buscarAsientosDisponibles, informacionHorarios} = require("../controllers/boletoControllers");

router.post('/boletos', crearBoleto);
router.get('/boletos/asientos/:idHorarioFuncion', buscarAsientosDisponibles);
router.get('/boletos/horarios/:idPelicula', informacionHorarios);

module.exports = router;