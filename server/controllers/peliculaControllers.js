const Pelicula = require('../modules/pelicula');

const listarPeliculas = async (req, res) => {
    let obj = new Pelicula();
    const resultado = await obj.listarPeliculas();
    console.log("si estoy funcionando");
    obj.destructor();
    res.status(200).json(resultado);
};

const obtenerDetallesPelicula = async (req, res) => {
    let obj = new Pelicula();
    const idOTitulo = req.params.idOTitulo;
    const resultado = await obj.obtenerDetallesPelicula(idOTitulo);
    obj.destructor();
    res.status(200).json(resultado);
};

const obtenerPeliculasPorEstado = async (req, res) => {
    let obj = new Pelicula();
    const estado = req.params.estado;
    const resultado = await obj.obtenerPeliculasPorEstado({ estado });
    obj.destructor();
    res.status(200).json(resultado);
};

const buscarPeliculas = async (req, res) => {
    let obj = new Pelicula();
    const { query } = req.query;
    const resultado = await obj.buscarPeliculas(query);
    obj.destructor();
    res.status(200).json(resultado);
};

module.exports = {
    listarPeliculas,
    obtenerDetallesPelicula,
    obtenerPeliculasPorEstado,
    buscarPeliculas
}