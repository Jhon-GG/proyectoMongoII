// app.js

const express = require('express');
const cors = require('cors');
const peliculaRoutes = require('./server/router/pelicula.routes.js');
// ... otros requires para tus demás rutas

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/pelicula', peliculaRoutes);
// ... otras rutas que ya tengas configuradas

// Configuración del servidor
const host = process.env.EXPRESS_HOST || 'localhost';
const port = parseInt(process.env.EXPRESS_PORT) || 5001;

// Iniciar el servidor
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});