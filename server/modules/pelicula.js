const  connect  = require ('../../server/db/connect.js')
const { ObjectId } = require ("mongodb")


// 1. Seleccion de peliculas

module.exports = class pelicula extends connect {
    static instancePelicula;
    db;
    collection;

    constructor() {
        if (pelicula.instancePelicula) {
            return pelicula.instancePelicula;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('pelicula');
        pelicula.instancePelicula = this;
    }
    destructor() {
        pelicula.instancePelicula = undefined;
        connect.instanceConnect = undefined;
    }


        /**
     * Obtiene una lista de películas desde la base de datos, incluyendo sus horarios de funciones asociados.
     * 
     * @returns {Promesa<Matriz>} Una promesa que se resuelve en una matriz de objetos de película. Cada objeto de película contiene las siguientes propiedades:
     * - id: El identificador único de la película.
     * - titulo: El título de la película.
     * - genero: El género de la película.
     * - duracion: La duración de la película en minutos.
     * - estado: El estado actual de la película (por ejemplo, "en cartelera", "en pausa").
     * - estreno: La fecha de estreno de la película.
     * - director: El director de la película.
     * - horarios_funcion: Un array de objetos de horario de función asociados con la película. Cada objeto de horario de función contiene las siguientes propiedades:
     *   - id: El identificador único del horario de función.
     *   - id_pelicula: El identificador único de la película asociada con el horario de función.
     *   - fecha_funcion: La fecha y hora del horario de función.
     *   - sala: La sala de cine donde se lleva a cabo el horario de función.
     * 
     * Si una película no tiene horarios de función asociados, la propiedad 'horarios_funcion' contendrá un array con un solo objeto:
     * - mensaje: Un mensaje que indica que la película no se encuentra actualmente en cartelera.
     */
    async getPeliculas() {
        await this.conexion.connect();
        
        const data = await this.collection.aggregate([
            {
                $lookup: {
                    from: 'horario_funcion', 
                    localField: 'id', 
                    foreignField: 'id_pelicula', 
                    as: 'horarios_funcion' 
                }
            },
            {
                $addFields: {
                    horarios_funcion: {
                        $cond: {
                            if: { $eq: [{ $size: "$horarios_funcion" }, 0] },
                            then: [{ mensaje: "Esta película no se encuentra en cartelera todavía" }],
                            else: "$horarios_funcion" 
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, 
                    id: 1, 
                    titulo: 1,
                    genero: 1,
                    duracion: 1,
                    estado: 1,
                    estreno: 1,
                    director: 1,
                    horarios_funcion: 1,
                    actores: 1 
                }
            }
        ]).toArray();

        await this.conexion.close();
        return data;
    }


            /**
     * Obtiene una película específica por su identificador desde la base de datos, incluyendo sus horarios de funciones asociados.
     * 
     * @param {string} id - El identificador único de la película que se desea obtener.
     * @returns {Promise<Object>} Una promesa que se resuelve en un objeto de película. Si no se encuentra la película, se resuelve en un objeto con un mensaje de error.
     * 
     * El objeto de película contiene las siguientes propiedades:
     * - id: El identificador único de la película.
     * - titulo: El título de la película.
     * - genero: El género de la película.
     * - duracion: La duración de la película en minutos.
     * - estado: El estado actual de la película (por ejemplo, "en cartelera", "en pausa").
     * - sinopsis: La sinopsis de la película.
     * - estreno: La fecha de estreno de la película.
     * - director: El director de la película.
     * - horarios_funcion: Un array de objetos de horario de función asociados con la película. Cada objeto de horario de función contiene las siguientes propiedades:
     *   - id: El identificador único del horario de función.
     *   - id_pelicula: El identificador único de la película asociada con el horario de función.
     *   - fecha_funcion: La fecha y hora del horario de función.
     *   - sala: La sala de cine donde se lleva a cabo el horario de función.
     * 
     * Si no se encuentra la película con el identificador proporcionado, se resuelve en un objeto con la siguiente propiedad:
     * - mensaje: Un mensaje que indica que no se encontró la película con el identificador proporcionado.
     */
    async getPeliculaById(id) {
        await this.conexion.connect();
        
        const numericId = parseInt(id);
    
        const data = await this.collection.aggregate([
            {
                $match: { id: numericId } // Usamos el id numérico
            },
            {
                $lookup: {
                    from: 'horario_funcion', 
                    localField: 'id', 
                    foreignField: 'id_pelicula', 
                    as: 'horarios_funcion' 
                }
            },
            {
                $addFields: {
                    horarios_funcion: {
                        $cond: {
                            if: { $eq: [{ $size: "$horarios_funcion" }, 0] }, 
                            then: [{ mensaje: "Esta película no se encuentra en cartelera todavía" }], 
                            else: "$horarios_funcion" 
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0, 
                    id: 1, 
                    titulo: 1,
                    genero: 1,
                    duracion: 1,
                    estado: 1,
                    sinopsis: 1,
                    estreno: 1,
                    director: 1,
                    horarios_funcion: 1,
                    actores: 1 
                }
            }
        ]).toArray();

        await this.conexion.close();

        if (data.length === 0) {
            return { mensaje: "ID de película no encontrado" };
        }
        return data[0];  
    }
    
    
    async getPeliculaByEstado({ estado }) {
        try {
            await this.conexion.connect();

            const peliculas = await this.collection.aggregate([
                {
                    $match: { estado: estado }
                },
                {
                    $lookup: {
                        from: 'horario_funcion',
                        localField: 'id',
                        foreignField: 'id_pelicula',
                        as: 'horarios_funcion'
                    }
                },
                {
                    $addFields: {
                        horarios_funcion: {
                            $cond: {
                                if: { $eq: [{ $size: "$horarios_funcion" }, 0] },
                                then: [{ mensaje: "Esta película no se encuentra en cartelera todavía" }],
                                else: "$horarios_funcion"
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        titulo: 1,
                        sinopsis: 1,
                        fecha_estreno: 1,
                        genero: 1,
                        duracion: 1,
                        estado: 1,
                        pais_origen: 1,
                        imagen_pelicula: 1,
                        reparto: 1,
                        trailer: 1,
                        director: 1,
                        horarios_funcion: 1
                    }
                }
            ]).toArray();
    
            if (peliculas.length === 0) {
                return { error: `No se encontraron películas con el estado: ${estado}` };
            }
    
            return peliculas;
    
        } catch (error) {
            return { error: `Error al obtener las películas: ${error.message}` };
        } finally {
            await this.conexion.close();
        }
    }
}

