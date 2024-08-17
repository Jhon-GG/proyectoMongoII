const Rol = require('../modules/rol');

const crearUsuario = async (req, res) => {
  let obj = new Rol();
  const resultado = await obj.crearUsuario(req.body);
  res.status(200).json(resultado);
};

const buscarUsuarioPorId = async (req, res) => {
  let obj = new Rol();
  const resultado = await obj.buscarUsuarioPorId(req.params.id);
  res.status(200).json(resultado);
};

const cambiarRolUsuario = async (req, res) => {
  let obj = new Rol();
  const resultado = await obj.cambiarRolUsuario(req.body);
  res.status(200).json(resultado);
};

const buscarUsuariosPorRol = async (req, res) => {
    try {
      let obj = new Rol();
      const rol = req.params.rol;
      console.log('Rol solicitado:', rol);
      const resultados = await obj.buscarUsuariosPorRol(rol);
      
      if (resultados.length === 0) {
        return res.status(404).json({ mensaje: `No se encontraron usuarios con el rol ${rol}` });
      }
      
      res.status(200).json(resultados);
    } catch (error) {
      console.error('Error en buscarUsuariosPorRol:', error);
      res.status(500).json({ mensaje: error.message });
    }
  };


  const getAllUsers = async (req, res) => {
    try {
      let obj = new Rol();
      const usuarios = await obj.getAllUsers();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      res.status(500).json({ mensaje: error.message });
    }
  };
  
module.exports = { crearUsuario, buscarUsuarioPorId, cambiarRolUsuario, buscarUsuariosPorRol,getAllUsers };