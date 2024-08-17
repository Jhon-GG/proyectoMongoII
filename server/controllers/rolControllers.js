const Rol = require('../modules/rol');

const crearUsuario = async (req, res) => {
    let obj = new Rol();
    const resultado = await obj.crearUsuario(req.body);
    obj.destructor();
    res.status(201).json(resultado);
};

const buscarUsuarioPorId = async (req, res) => {
    let obj = new Rol();
    const id = req.params.id;
    const resultado = await obj.buscarUsuarioPorId(id);
    obj.destructor();
    res.status(200).json(resultado);
};

const cambiarRolUsuario = async (req, res) => {
    let obj = new Rol();
    const resultado = await obj.cambiarRolUsuario(req.body);
    obj.destructor();
    res.status(200).json(resultado);
};

const buscarUsuariosPorRol = async (req, res) => {
    let obj = new Rol();
    const rol = req.params.rol;
    const resultado = await obj.buscarUsuariosPorRol(rol);
    obj.destructor();
    res.status(200).json(resultado);
};

const getAllUsers = async (req, res) => {
    let obj = new Rol();
    const resultado = await obj.getAllUsers();
    obj.destructor();
    res.status(200).json(resultado);
};

module.exports = {
    crearUsuario,
    buscarUsuarioPorId,
    cambiarRolUsuario,
    buscarUsuariosPorRol,
    getAllUsers
};