
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
                //msg = "Bienvenido al sistema, "+nick;
                //cw.mostrarMensaje(msg);
            }
            else{
                console.log("El nick ya está ocupado");
            }
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

    this.registrarUsuario=function(email,password){
        $.ajax({
            type:'POST',
            url:'/registrarUsuario',
            data: JSON.stringify({"email":email,"password":password}),
            success:function(data){
                if (data.nick!=-1){
                    console.log("Usuario "+data.nick+" ha sido registrado");
                    $.cookie("nick",data.nick);
                    cw.limpiar();
                    cw.mostrarMensaje("Bienvenido al sistema, "+data.nick);
                    //cw.mostrarLogin();
                }
                else{
                    console.log("El nick está ocupado");
                }
            },
            error:function(xhr, textStatus, errorThrown){
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType:'application/json'
        });
    }

    this.loginUsuario = function(email, password) {
        $.ajax({
            type: 'POST',
            url: '/loginUsuario',
            data: JSON.stringify({ "email": email, "password": password }),
            success: function(data) {
                if (data.nick != -1) {
                    console.log("Usuario " + data.nick + " ha iniciado sesión");
                    $.cookie("nick", data.nick);
                    cw.limpiar();
                    cw.mostrarMensaje("Bienvenido al sistema, " + data.nick);
                } else {
                    console.log("No se pudo iniciar sesión");
                    cw.mostrarLogin();
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                console.log("Status: " + textStatus);
                console.log("Error: " + errorThrown);
            },
            contentType: 'application/json'
        });
    }


}