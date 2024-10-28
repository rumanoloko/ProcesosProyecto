
function ClienteRest(){
    this.agregarUsuario=function(nick){
        var cli=this;
        $.getJSON("/agregarUsuario/"+nick,function(data){
            if (data.nick!=-1){
                console.log("Usuario "+nick+" ha sido registrado")
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



}