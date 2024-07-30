import { connect } from "../../helpers/db/connect.js"
import { ObjectId } from "mongodb";


export class rol extends connect {
    static instanceRol;
    db;
    collection;

    constructor() {
        if (rol.instanceRol) {
            return rol.instanceRol;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('usuario');
        rol.instanceRol = this;
    }
    destructor() {
        rol.instanceRol = undefined;
        connect.instanceConnect = undefined;
    }

}