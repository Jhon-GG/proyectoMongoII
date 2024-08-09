const express = require('express');
const Rol = require('../modules/rol.js');

const router = express.Router();

// Crear un nuevo usuario
router.post('/crear', async (req, res) => {
    try {
        const rolInstance = new Rol();
        const resultado = await rolInstance.crearUsuario(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuario por ID
router.get('/buscar/:id', async (req, res) => {
    try {
        const rolInstance = new Rol();
        const usuario = await rolInstance.buscarUsuarioPorId(req.params.id);
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cambiar rol de usuario
router.put('/cambiar-rol', async (req, res) => {
    try {
        const rolInstance = new Rol();
        const resultado = await rolInstance.cambiarRolUsuario(req.body);
        res.json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Buscar usuarios por rol
router.get('/usuarios/:rol', async (req, res) => {
    try {
        const rolInstance = new Rol();
        const usuarios = await rolInstance.buscarUsuariosPorRol(req.params.rol);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;