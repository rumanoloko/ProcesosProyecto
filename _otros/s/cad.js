const {MongoClient: mongo} = require("mongodb");

const mongo=require("mongodb").MongoClient;
const ObjectId=require("mongodb").ObjectId;

function CAD() {
    this.usuarios;
    this.conectar=async function(callback){
        let cad=this;
        let client= new
        mongo("mongodb+srv://pasatpetruvlad:cDN9UXz7RiYmjFP1@cluster0.faqzx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        await client.connect();
        const database=client.db("sistema");
        cad.usuarios=database.collection("usuarios");
        callback(database);
    }
}
module.export.CAD = CAD;