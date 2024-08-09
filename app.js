

const express = require('express');
const cors = require('cors');
const peliculaRoutes = require('./server/router/pelicula.routes.js');
// const asientoRoutes = require('./server/router/asiento.routes.js');
// const boletoRoutes = require('./server/router/boleto.routes.js');
// const descuentoRoutes = require('./server/router/descuento.routes.js');
// const pagoRoutes = require('./server/router/pago.routes.js');
// const rolRoutes = require('./server/router/rol.routes.js');

const app = express();

// Habilitar CORS para todas las rutas
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/pelicula', peliculaRoutes);
// app.use('/asiento', asientoRoutes);
// app.use('/boleto', boletoRoutes);
// app.use('/descuento', descuentoRoutes);
// app.use('/pago', pagoRoutes);
// app.use('/rol', rolRoutes);


// Configuración del servidor
const host = process.env.EXPRESS_HOST || 'localhost';
const port = parseInt(process.env.EXPRESS_PORT) || 5001;

// Iniciar el servidor
app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});

