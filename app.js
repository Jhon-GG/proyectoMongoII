const express = require('express');
const cors = require('cors');
const peliculaRoutes = require('./server/router/pelicula.routes');
const boletoRoutes = require('./server/router/boleto.routes');
const reservaRoutes = require('./server/router/reserva.routes');
const tarjetaVipRoutes = require('./server/router/tarjetaVip.routes');
const usuarioRoutes = require('./server/router/usuario.routes');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/pelicula', peliculaRoutes);
app.use('/boleto', boletoRoutes);
app.use('/reserva', reservaRoutes);
app.use('/tarjeta-vip', tarjetaVipRoutes);
app.use('/usuario', usuarioRoutes);

// Configuración del servidor
const host = process.env.EXPRESS_HOST || 'localhost';
const port = parseInt(process.env.EXPRESS_PORT) || 5001; // Cambiado a 5001 para coincidir con tu frontend

// Iniciar el servidor
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});