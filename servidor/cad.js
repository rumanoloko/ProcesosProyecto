const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

function CAD() {
    this.usuarios = null;
    this.logs = null;

    this.conectar = async function (callback) {
        let cad = this;
        let client = new mongo(
            "mongodb+srv://rumanoLoko:B093XoFk8cVOTaHX@cluster0.gqvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        );
        await client.connect();
        const database = client.db("sistema");
        cad.usuarios = database.collection("usuarios");
        cad.logs = database.collection("logs"); // Conexión a la colección logs
        callback(database);
    };

    // Registrar actividad en logs
    this.registrarLog = async function (tipoOperacion, usuario) {
        if (!this.logs) {
            console.error("La colección logs no está inicializada.");
            return;
        }
        const log = {
            "tipo-operacion": tipoOperacion,
            "usuario": usuario,
            "fecha-hora": new Date().toISOString()
        };
        await this.logs.insertOne(log);
        console.log("Actividad registrada:", log);
    };

    this.buscarOCrearUsuario = function (usr, callback) {
        buscarOCrear(this.usuarios, usr, callback);
        // Registrar actividad para buscar o crear usuario
        this.registrarLog("registroUsuario", usr.email).catch(console.error);
    };

    this.buscarUsuario = function (obj, callback) {
        buscar(this.usuarios, obj, callback);
        // Registrar actividad para búsqueda de usuario
        this.registrarLog("buscarUsuario", obj.email).catch(console.error);
    };

    this.insertarUsuario = function (usuario, callback) {
        insertar(this.usuarios, usuario, callback);
        // Registrar actividad para inserción de usuario
        this.registrarLog("registroUsuario", usuario.email).catch(console.error);
    };

    this.actualizarUsuario = function (obj, callback) {
        actualizar(this.usuarios, obj, callback);
        // Registrar actividad para actualización de usuario
        this.registrarLog("actualizarUsuario", obj.email).catch(console.error);
    };

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

    function buscar(coleccion, criterio, callback) {
        coleccion.find(criterio).toArray(function (error, usuarios) {
            if (usuarios.length == 0) {
                callback(undefined);
            } else {
                callback(usuarios[0]);
            }
        });
    }

    function insertar(coleccion, elemento, callback) {
        coleccion.insertOne(elemento, function (err, result) {
            if (err) {
                console.log("error");
            } else {
                console.log("Nuevo elemento creado");
                callback(elemento);
            }
        });
    }

    function actualizar(coleccion, obj, callback) {
        coleccion.findOneAndUpdate(
            { _id: ObjectId(obj._id) },
            { $set: obj },
            { upsert: false, returnDocument: "after", projection: { email: 1 } },
            function (err, doc) {
                if (err) {
                    throw err;
                } else {
                    console.log("Elemento actualizado");
                    callback({ email: doc.value.email });
                }
            }
        );
    }
}
module.exports.CAD = CAD;
