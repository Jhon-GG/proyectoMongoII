import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";


// 1. Seleccion de peliculas

export class pelicula extends connect {
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

    async getTest() {
        await this.conexion.connect();
        const collection = this.db.collection('test');
        const data = await collection.find({}).toArray();
        await this.conexion.close();
        return data;
    }

}