const datos=require("./cad.js");
this.cad=new datos.CAD();

function Sistema() {
    this.cad=new datos.CAD();
    this.cad.conectar(function(db){
        console.log("Conectado a Mongo Atlas");
    });
    this.usuarios=[];
    this.agregarUsuario = (nick) => {
        return !this.usuarios[nick] ? (this.usuarios[nick] = new Usuario(String(nick)), true) : false;
    };
    this.eliminarUsuario = (nick) => {
        return this.usuarios[nick] ? (delete this.usuarios[nick], true) : false;
    };
}

function Usuario(nick) {
    this.nick = nick;
}

