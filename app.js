const express = require('express');
const cors = require('cors');
const peliculaRoutes = require('./server/router/pelicula.routes.js');
const asientoRoutes = require('./server/router/asiento.routes.js');
const boletoRoutes = require('./server/router/boleto.routes.js');
const pagoRoutes = require('./server/router/pago.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/pelicula', peliculaRoutes);
app.use('/asiento', asientoRoutes);
app.use('/boleto', boletoRoutes);
app.use('/pago', pagoRoutes);

const host = process.env.EXPRESS_HOST || 'localhost';
const port = parseInt(process.env.EXPRESS_PORT) || 5001;

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});