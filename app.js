const express = require ('express');
const pelicula = require ('./js/modules/pelicula')
const app = express();

app.get("/pelicula",async (req,res)=>{
    let obj = new pelicula();
    res.status(200).send(await obj.getPeliculas());
})

app.listen({
    host: process.env.EXPRESS_HOST, 
    port: parseInt(process.env.EXPRESS_PORT)
}, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});