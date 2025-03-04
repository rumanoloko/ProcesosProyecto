
function Sistema() {
    this.usuarios=[];
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

    this.eliminarUsuario = (nick) =>{
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


