function ClienteRest() {
    this.agregarUsuario=function(nick){
        var cli=this;
        $.getJSON("/agregarUsuario/"+nick,function(data){
            let msg="El nick "+nick+" está ocupado";
            if (data.nick!=-1){
                console.log("Usuario "+nick+" ha sido registrado");
                msg="Bienvenido al sistema, "+nick;
                $.cookie("nick",nick);
            }
            else{
                console.log("El nick ya está ocupado");
            }
            cw.mostrarMensaje(msg);
        });
    }
}