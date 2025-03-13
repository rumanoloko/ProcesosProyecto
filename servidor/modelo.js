const datos=require("./cad.js");
const correo = require("./email.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

function Sistema() {
    this.usuarios=[];
    this.cad=new datos.CAD();
    this.cad.conectar(function(db){
        console.log("Conectado a Mongo Atlas");
    });

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

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

    this.buscarUsuario=function(obj,callback){
        buscar(this.usuarios,obj,callback);
    }

    this.insertarUsuario=function(usuario,callback){
        insertar(this.usuarios,usuario,callback);
    }
    this.registrarUsuario=function(obj,callback){
        let modelo=this;
        if (!obj.nick){
            obj.nick=obj.email;
        }
        this.cad.buscarUsuario(obj,function(usr){
            if (!usr){
                //el usuario no existe, luego lo puedo registrar
                obj.key=Date.now().toString();
                obj.confirmada=false;
                modelo.cad.insertarUsuario(obj,function(res){
                    callback(res);
                });
                correo.enviarEmail(obj.email,obj.key,"Confirmar cuenta");
            }
            else
            {
                callback({"email":-1});
            }
        });
    }





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



    this.loginUsuario=function(obj,callback){
        this.cad.buscarUsuario({"email":obj.email,"confirmada":true},function(usr){
            if(usr && usr.password==obj.password)
            {
                callback(usr);
            }
            else
            {
                callback({"email":-1});
            }
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
            } else {
                callback({"email":-1});
            }
        })
    }
}

function Usuario(nick) {
    this.nick = nick;
}


module.exports.Sistema=Sistema


