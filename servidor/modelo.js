const datos=require("./cad.js");
const correo = require("./email.js");
function Sistema() {
    this.usuarios=[];
    this.cad=new datos.CAD();
    this.cad.conectar(function(db){
        console.log("Conectado a Mongo Atlas");
    });
    this.buscarUsuario=function(obj,callback){
        buscar(this.usuarios,obj,callback);
    }

    this.insertarUsuario=function(usuario,callback){
        insertar(this.usuarios,usuario,callback);
    }

    this.usuarioGoogle=function(usr,callback){
        this.cad.buscarOCrearUsuario(usr,function(obj){
            callback(obj);
        });
    }
    this.agregarUsuario=function(nick){
        let res={"nick":-1};
        if (!this.usuarios[nick]){
            this.usuarios[nick]=new Usuario(nick);
            res.nick=nick;
        }
        else{
            console.log("el nick "+nick+" está en uso");
        }
        return res;
    }

    this.eliminarUsuario = (nick) => {
        return this.usuarios[nick] ? (delete this.usuarios[nick], true) : false;
    };

    this.usuarioActivo = (nick) =>{
        return this.usuarios[nick] ? true : false;
    }

    this.obtenerUsuarios = () =>{
        return Object.values(this.usuarios);
        //return this.usuarios;
    }

    this.cantidadUsuarios = () => {
        return Object.keys(this.usuarios).length;
    }

    this.registrarUsuario = function (obj, callback) {
        let modelo = this;
        if (!obj.nick) {
            obj.nick = obj.email;
        }

        // Genera un hash de la clave antes de almacenarla
        bcrypt.hash(obj.password, 10, function (err, hash) {
            if (err) {
                console.error(err);
                return callback({ "error": "No se pudo cifrar la clave" });
            }

            // Sustituye la clave original con el hash
            obj.password = hash;

            modelo.cad.buscarUsuario({"email":obj.email}, function (usr) {
                if (!usr) {


                    // El usuario no existe, luego lo puedo registrar
                    obj.key = Date.now().toString();
                    obj.confirmada = false;
                    modelo.cad.insertarUsuario(obj, function (res) {

                        callback(res);
                    });
                    correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");

                }
                else {

                    console.log("El email ya esta ocupado")
                    callback({"email": -1});
                }
            });
        });
    }

    this.confirmarUsuario=function(obj,callback){
        let modelo=this;
        this.cad.buscarUsuario({"email":obj.email,"confirmada":false,"key":obj.key},function(usr){
            if (usr){
                usr.confirmada=true;
                modelo.cad.actualizarUsuario(usr,function(res){
                    callback({"email":res.email}); //callback(res)
                })
            }
            else
            {
                callback({"email":-1});
            }
        })
    }

    // Método para verificar la clave durante el inicio de sesión
    this.loginUsuario = function (obj, callback) {

        this.cad.buscarUsuario({ "email":obj.email, "confirmada":true }, function (usr) {
            if (usr) {
                // Compara la clave cifrada almacenada en la base de datos con la clave proporcionada


                bcrypt.compare(obj.password, usr.password, function (err, result) {
                    if (err) {
                        console.error(err);
                        return callback({ "error": "Error al comparar las claves" });
                    }

                    if (result) {
                        console.log("Las contraseñas coinciden.");
                        callback(usr);

                    } else {
                        console.log("Las contraseñas no coinciden.");
                        callback({ "email": -1 });
                    }
                });
            } else {
                callback({ "email": -1 });
            }
        });
    }
}

function Usuario(nick) {
    this.nick = nick;
}

module.exports.Sistema=Sistema


