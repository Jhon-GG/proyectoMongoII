const express = require('express');
const path = require('path');
const app = express();
const peliculaRoutes = require("./server/router/pelicula.routes");
const rolRoutes = require('./server/router/rol.routes');
require('dotenv').config();


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'views', 'index.html'));
});

app.use('/api', peliculaRoutes);
app.use('/api', rolRoutes);


app.listen({
    host: process.env.EXPRESS_HOST,
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    console.log(`Servidor corriendo en: http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});