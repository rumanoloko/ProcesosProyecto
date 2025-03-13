const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

function CAD() {
    this.usuarios = null;
    this.conectar = async function (callback) {
        let cad = this;
        let client =new mongo(
            "mongodb+srv://rumanoLoko:B093XoFk8cVOTaHX@cluster0.gqvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        );
        await client.connect();
        const database = client.db("sistema");
        cad.usuarios = database.collection("usuarios");
        <!--console.log("Conectado a Mongo Atlas");-->
        //console.log("Contenido de cad.usuarios")
        //console.log(database);
        callback(database);
    };

    this.buscarOCrearUsuario = function (usr, callback) {
        buscarOCrear(this.usuarios, usr, callback);
    };
    this.buscarUsuario=function(obj,callback){
        buscar(this.usuarios,obj,callback);
    }
    this.insertarUsuario=function(usuario,callback){
        insertar(this.usuarios,usuario,callback);
    }
    this.actualizarUsuario=function(obj,callback){
        actualizar(this.usuarios,obj,callback);
    }
    function buscarOCrear(coleccion,criterio,callback)
    {
        coleccion.findOneAndUpdate(criterio, {$set: criterio}, {upsert:
                true,returnDocument:"after",projection:{email:1}}, function(err,doc) {
            if (err) { throw err; }
            else {
                console.log("Elemento actualizado");
                console.log(doc.value.email);
                callback({email:doc.value.email});
            }
        });
    }
    function actualizar(coleccion,obj,callback){
        coleccion.findOneAndUpdate({_id:ObjectId(obj._id)}, {$set: obj},
            {upsert: false,returnDocument:"after",projection:{email:1}},
            function(err,doc) {
                if (err) { throw err; }
                else {
                    console.log("Elemento actualizado");
                    callback({email:doc.value.email});
                }
            });
    }

}
////Pinta que no
/*
function buscarOCrear(coleccion, criterio, callback) {
    coleccion.findOneAndUpdate(
        criterio,
        { $set: criterio },
        { upsert: true, returnDocument: "after", projection: { email: 1 } },
        function (err, doc) {
            if (err) {
                throw err;
            } else {
                console.log("Elemento actualizado");
                console.log(doc.value.email);
                callback({ email: doc.value.email });
            }
        }
    );
}
 */

function buscar(coleccion,criterio,callback){
    coleccion.find(criterio).toArray(function(error,usuarios){
        if (usuarios.length==0){
            callback(undefined);
        }
        else{
            callback(usuarios[0]);
        }
    });
}

function insertar(coleccion,elemento,callback){
    coleccion.insertOne(elemento,function(err,result){
        if(err){
            console.log("error");
        }
        else{
            console.log("Nuevo elemento creado");
            callback(elemento);
        }
    });
}

module.exports.CAD = CAD;

