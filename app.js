const express = require('express');
const path = require('path');
const app = express();
const peliculaRoutes = require("./server/router/pelicula.routes");
const rolRoutes = require('./server/router/rol.routes');
const boletoRoutes = require('./server/router/boleto.routes');
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.use('/api', peliculaRoutes);
app.use('/api', rolRoutes);
app.use('/api', boletoRoutes);

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

app.listen({
    host: process.env.EXPRESS_HOST,
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    console.log(`Servidor corriendo en: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});