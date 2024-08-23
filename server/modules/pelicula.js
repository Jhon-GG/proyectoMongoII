
const connect = require("../db/connect");

module.exports = class Pelicula extends connect {

    static instancePelicula;
    db;
    collection;

    constructor() {
        if (Pelicula.instancePelicula) {
            return Pelicula.instancePelicula;
        }
        super();
        this.db = this.conexion.db(process.env.MONGO_DB);
        this.collection = this.db.collection('pelicula');
        Pelicula.instancePelicula = this;
    }

    destructor() {
        Pelicula.instancePelicula = undefined;
        connect.instanceConnect = undefined;
    }

    async listarPeliculas() {
        try {
            const peliculas = await this.collection.find({
                estado: { $in: ["En cartelera", "Próximo estreno"] }
            }).toArray();

            const peliculasConHorarios = await Promise.all(peliculas.map(async (pelicula) => {
                const horarios = await this.db.collection('horario_funcion').find(
                    { id_pelicula: pelicula.id },
                    {
                        projection: {
                            _id: 0,
                            fecha_funcion: 1,
                            horario_funcion: 1,
                            hora_finalizacion: 1,
                            id_sala: 1,
                            precio_pelicula: 1
                        }
                    }
                ).toArray();

                return {
                    id: pelicula.id,
                    titulo: pelicula.titulo,
                    sinopsis: pelicula.sinopsis,
                    estreno: pelicula.estreno,
                    genero: pelicula.genero,
                    duracion: pelicula.duracion,
                    estado: pelicula.estado,
                    director: pelicula.director,
                    imagen_pelicula: pelicula.imagen_pelicula,
                    actores: pelicula.actores,
                    trailer: pelicula.trailer,
                    horarios_funcion: horarios
                };
            }));

            return peliculasConHorarios;
        } catch (error) {
            return { error: `Error al listar las películas: ${error.message}` };
        }
    }

    async obtenerDetallesPelicula(idOTitulo) {
        try {
            let consulta;

            if (!isNaN(idOTitulo)) {
                consulta = { id: parseInt(idOTitulo) };
            } else {
                consulta = { titulo: { $regex: new RegExp(idOTitulo, 'i') } };
            }

            const pelicula = await this.collection.findOne(consulta);

            if (!pelicula) {
                return { error: `No se encontró una película con el ID o título ${idOTitulo}` };
            }

            const horarios = await this.db.collection('horario_funcion').find(
                { id_pelicula: pelicula.id },
                {
                    projection: {
                        _id: 0,
                        fecha_funcion: 1,
                        horario_funcion: 1,
                        hora_finalizacion: 1,
                        id_sala: 1,
                        precio_pelicula: 1
                    }
                }
            ).toArray();

            return {
                id: pelicula.id,
                titulo: pelicula.titulo,
                sinopsis: pelicula.sinopsis,
                estreno: pelicula.estreno,
                genero: pelicula.genero,
                duracion: pelicula.duracion,
                estado: pelicula.estado,
                director: pelicula.director,
                imagen_pelicula: pelicula.imagen_pelicula,
                actores: pelicula.actores,
                trailer: pelicula.trailer,
                horarios_funcion: horarios
            };
        } catch (error) {
            return { error: `Error al obtener los detalles de la película: ${error.message}` };
        }
    }

    async obtenerPeliculasPorEstado({ estado }) {
        try {
            const peliculas = await this.collection.find(
                { estado: estado },
                {
                    projection: {
                        _id: 0,
                        id: 1,
                        titulo: 1,
                        sinopsis: 1,
                        estreno: 1,
                        genero: 1,
                        duracion: 1,
                        estado: 1,
                        director: 1,
                        imagen_pelicula: 1,
                        actores: 1,
                        trailer: 1
                    }
                }
            ).toArray();
    
            if (peliculas.length === 0) {
                return { error: `No se encontraron películas con el estado: ${estado}` };
            }
    
            const peliculasConHorarios = await Promise.all(peliculas.map(async (pelicula) => {
                const horarios = await this.db.collection('horario_funcion').find(
                    { id_pelicula: pelicula.id },
                    {
                        projection: {
                            _id: 0,
                            fecha_funcion: 1,
                            horario_funcion: 1,
                            hora_finalizacion: 1,
                            id_sala: 1,
                            precio_pelicula: 1
                        }
                    }
                ).toArray();
    
                return { ...pelicula, horarios_funcion: horarios };
            }));
    
            return peliculasConHorarios;
        } catch (error) {
            console.error(`Error al obtener las películas por estado: ${error.message}`);
            return { error: `Error al obtener las películas por estado: ${error.message}` };
        }
    }

    async buscarPeliculas(query) {
        try {
            if (!query) {
                return { error: "Se requiere un término de búsqueda" };
            }
    
            const cleanQuery = query.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            const regexQuery = new RegExp(cleanQuery, 'i');
    
            const peliculas = await this.collection.find({
                $or: [
                    { titulo: { $regex: regexQuery } },
                    { genero: regexQuery },
                    { director: regexQuery },
                    { estado: regexQuery },
                    { "actores.nombre": regexQuery },
                    { "actores.personaje": regexQuery }
                ]
            }).toArray();
    
            if (peliculas.length === 0) {
                return { message: "No se encontraron películas que coincidan con la búsqueda" };
            }
    
            return peliculas;
        } catch (error) {
            return { error: `Error al buscar películas: ${error.message}` };
        }
    }
};