const Boleto = require('../modules/boleto');

const crearBoleto = async (req, res) => {
    let obj = new Boleto();
    const nuevoBoleto = req.body;
    const resultado = await obj.crearBoleto1(nuevoBoleto);
    obj.destructor();
    res.status(200).json(resultado);
};

const buscarAsientosDisponibles = async (req, res) => {
    let obj = new Boleto();
    const idHorarioFuncion = req.params.idHorarioFuncion;
    const resultado = await obj.buscarAsientosDisponibles(idHorarioFuncion);
    obj.destructor();
    res.status(200).json(resultado);
};

const informacionHorarios = async (req, res) => {
    let obj = new Boleto();
    const idPelicula = req.params.idPelicula;
    const resultado = await obj.informacionhorarios(idPelicula);
    obj.destructor();
    res.status(200).json(resultado);
};

module.exports = {
    crearBoleto,
    buscarAsientosDisponibles,
    informacionHorarios
}