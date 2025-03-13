
function ClienteRest(){
    this.comprobarSesion=function() {
        let nick= $.cookie('nick');
        if(nick) {
            cw.mostrarMensaje("Bienvenido al sistema, ", nick);
        }else {
            cw.mostrarAgregarUsuario();
        }
    }
    this.agregarUsuario=function(nick){
        var cli=this;
        $.getJSON("/agregarUsuario/"+nick,function(data){
            if (data.nick!=-1){
                console.log("Usuario "+nick+" ha sido registrado")
            }
            else{
                console.log("El nick ya está ocupado");
            }
            msg = "Bienvenido al sistema, "+nick;
            cw.mostrarMensaje(msg);
        })
    }
    this.agregarUsuario2 = function(nick) {
        $.ajax({
            type:'GET',
            url:'/agregarUsuario/'+nick,
            success:function(data){
                if (data.nick!=-1){
                    console.log("Usuario "+nick+" ha sido registrado")
                    $.cookie("nick", nick);
                }
                else{
                    console.log("El nick ya está ocupado");
                }
            },
            error:function(xhr, textStatus, errorThrown){
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType:'application/json'
        });
    }
    this.numeroUsuarios = function(callback) {
        $.getJSON("/numeroUsuarios/", function(data) {
            callback(data);
        }).fail(function() {
            console.error("Error al obtener el número de usuarios");
            callback(null);
        });
    };

    this.obtenerUsuarios = function(callback){
        $.getJSON("/obtenerUsuarios/", function(data) {
            callback(data);
        }).fail(function() {
            console.error("Error al obtener los usuarios");
            callback(null);
        });
    };

    this.usuarioActivo = function(nick, callback) {
        $.getJSON("/usuarioActivo/"+nick, function(data) {
            callback(data)
        }).fail(function() {
            console.error("Error al obtener un usuario activo");
            callback(null);
        });
    };

    this.eliminarUsuario = function(nick, callback) {
        $.getJSON("/eliminarUsuario/"+nick, function(data) {
            callback(data)
        }).fail(function() {
            console.error("Error al intentar eliminar un usuario");
            callback(null);
        });
    };

    this.registrarUsuario = function(email, password) {
        $.ajax({
            type: 'POST',
            url: '/registrarUsuario',
            data: JSON.stringify({"email": email, "password": password}),
            success: function(data) {
                if (data.nick != -1) {
                    $.cookie("nick", data.nick);
                    cw.limpiarInterfaz();
                    cw.mostrarMensaje("Bienvenido al sistema, " + data.nick);
                } else {
                    console.log("Ya hay un usuario registrado con ese email");
                    //cw.mostrarMensajeLogin("Ya hay un usuario registrado con ese email");
                    cw.mostrarModal("No se ha podido registrar el usuario");
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType: 'application/json'
        });
    };


    this.loginUsuario = function(usuario) {
        $.ajax({
            type: 'POST',
            url: '/loginUsuario',
            data: JSON.stringify(usuario),
            success: function(data) {
                if (data.nick != -1) {
                    console.log("Usuario " + data.nick + " ha iniciado sesión");
                    $.cookie("nick", data.nick);
                    cw.limpiarInterfaz();
                    cw.mostrarMensaje("Bienvenido al sistema, " + data.nick);
                } else {
                    console.log("No existe un usuario preexistente con ese email");
                    //cw.mostrarMensajeLogin("No hay un usuario preexistente con ese email");
                    cw.mostrarModal("No se ha podido inicar sesión con el usuario");
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType: 'application/json'
        });
    };

    this.cerrarSesion=function(){
        $.getJSON("/cerrarSesion",function(){
            console.log("Sesión cerrada");
            $.removeCookie("nick");
        });
    }


}