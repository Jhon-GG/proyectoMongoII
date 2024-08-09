
const { connect } = require  ("../../helpers/db/connect.js")
const { ObjectId } = require ("mongodb")


module.exports =  class test extends connect {
    static instanceTest;
    db;
    collection;

    constructor() {
        if (test.instanceTest) {
            return test.instanceTest;
        }
        super();
        this.db = this.conexion.db(this.getDbName);
        this.collection = this.db.collection('test');
        test.instanceTest = this;
    }
    destructor() {
        test.instanceTest = undefined;
        connect.instanceConnect = undefined;
    }


    // Probando probando 1, 2, 3

    async getTest() {
        await this.conexion.connect();
        const collection = this.db.collection('test');
        const data = await collection.find({}).toArray();
        await this.conexion.close();
        return data;
    }
}