const express = require('express');
const router = express.Router();
const { crearUsuario, buscarUsuarioPorId, cambiarRolUsuario, buscarUsuariosPorRol, getAllUsers } = require("../controllers/rolControllers");

router.post('/usuarios', crearUsuario);
router.get('/usuarios/todos', getAllUsers);
router.get('/usuarios/:id', buscarUsuarioPorId);
router.put('/usuarios/cambiar-rol', cambiarRolUsuario);
router.get('/usuarios/rol/:rol', buscarUsuariosPorRol);

module.exports = router;