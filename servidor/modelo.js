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
}

function Usuario(nick) {
    this.nick = nick;
}
this.registrarUsuario=function(obj,callback){
    let modelo=this;
    if (!obj.nick){
        obj.nick=obj.email;
    }
    this.cad.buscarUsuario(obj,function(usr){
        if (!usr){
            modelo.cad.insertarUsuario(obj,function(res){
                callback(res);
            });
        }
        else
        {
            callback({"email":-1});
        }
    });

    this.loginUsuario = function(obj, callback) {
        let modelo = this;
        this.cad.buscarUsuario({ "email": obj.email, "confirmada": true }, function(usr) {
            if (!usr) {
                callback({ "email": -1 });
                return -1;
            } else {
                bcrypt.compare(obj.password, usr.password, function(err, result) {
                    if (result) {
                        callback(usr);
                        modelo.agregarUsuario(usr);
                    } else {
                        callback({ "email": -1 });
                    }
                });
            }
        });
    }

}

module.exports.Sistema=Sistema


