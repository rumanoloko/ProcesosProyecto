function ControlWeb() {
    /*
        $('#bnv').remove();
        $('#mAU').remove();
        let cadena='<div id="mAU">';
        cadena = cadena + '<div class="card"><div class="card-body">';
        cadena = cadena +'<div class="form-group">';
        cadena = cadena + '<label for="nick">Nick:</label>';
        cadena = cadena + '<p><input type="text" class="form-control" id="nick" placeholder="Introduce un nombre"></p>';
        cadena = cadena + '<button id="btnAU" type="submit" class="btn btn-primary">Guardar</button>';
        cadena=cadena+'<div><a href="/auth/google"><img src="./cliente/img/google_signin_web.png" style="height:40px;"></a></div>';
        cadena = cadena + '</div>';
        cadena = cadena + '</div></div></div>';
        $("#au").append(cadena);
    }
    * */

    this.mostrarAgregarUsuario = function() {
        $("#au").empty();
        let cadena = `
        <div id="mAU" class="form-group">
            <label for="nick">Nombre:</label>
            <input type="text" class="form-control" id="nick">
            <button id="btnAU" type="submit" class="btn btn-primary">Agregar</button>
            <div>
                <a href="/auth/google">
                    <img src="./cliente/img/google_signin_web.png" alt="imagen de inicio de sesión de google" style="height:40px;">
                </a>
            </div>
        </div>`;
        $("#au").append(cadena); // Limpia e inserta el nuevo contenido de una vez
        $("#btnAU").on("click", function(){
            let nick = $("#nick").val();
            if(nick) {
                rest.agregarUsuario(nick);
                $("#mAU").remove();  // Borra el formulario después de agregar usuario
            } else {
                alert("Por favor ingresa un nombre.");
            }
        });


    };



    this.mostrarNumeroUsuarios = function() {
        //$("#registro").empty();
        //$("#nui").empty();
        $("#au2").empty();
        let cadena = '<div class="form-group" id="nui">';
        cadena += '<label id="lab" for="nick">Numero de Usuarios: </label>'; // Asigna un id="lab" al label
        cadena += '</div>';
        $("#au2").append(cadena);

        rest.numeroUsuarios(function(data) {
            if (data) {
                //let currentText = $("#lab").text(); // Obtener el texto actual del label
                $("#lab").text(/*currentText + */data.cantidad);
            } else {
                console.log("Error al obtener la cantidad de usuarios");
            }
        });
    };

    this.mostrarUsuarioActivo = function() {
        $("#registro").empty();
        let cadena = '<div id="mAU3" class="form-group">';
        cadena += '<label for="nick">Buscar usuario activo:</label>';
        cadena += '<input type="text" class="form-control" id="nick2">';
        cadena += '<label id="nico" class="w-100"></label>';
        cadena += '<button id="btnAU3" type="submit" class="btn btn-primary">Buscar usuario</button>';
        cadena += '</div>';
        $("#au3").append(cadena);
        $("#btnAU3").on("click", function(){
            let nick = $("#nick2").val();
            rest.usuarioActivo(nick,function(data) {
                if (data) {
                    $("#nico").text(nick+" existe como usuario");
                }else{
                    $("#nico").text(nick+" no es un usuario existente")
                }
            });
        })
    };

    this.mostrarEliminarUsuario = function() {
        $("#registro").empty();
        let cadena = '<div id="mAU4" class="form-group">';
        cadena += '<label for="nick">Nombre del usuario a eliminar:</label>';
        cadena += '<input type="text" class="form-control" id="nick4">';
        cadena += '<label id="nico2" class="w-100"></label>';
        cadena += '<button id="btnAU4" type="submit" class="btn btn-primary">Eliminar usuario</button>';
        cadena += '</div>';
        $("#au4").append(cadena);
        $("#btnAU4").on("click", function(){
            let nick = $("#nick4").val();
            rest.eliminarUsuario(nick,function(data) {
                if (data.eliminado) {
                    $("#nico2").text(nick+" eliminado con exito.");
                }else{
                    $("#nico2").text(nick+" no se pudo eliminar.")
                }
            });
        })
    };

    this.mostrarObtenerUsuarios = function() {
        $("#registro").empty();
        $("#nui5").empty();
        let cadena = '<div class="form-group" id="nui5">';
        cadena += '<label id="lab5" for="nick">Lista de usuarios: </label>'; // Asigna un id="lab" al label
        cadena += '</div>';

        $("#au5").append(cadena);

        rest.obtenerUsuarios(function(data) {

            if (data && Array.isArray(data)) {
                let currentText = $("#lab5").text();
                let nicks = data.map(user => user.nick).join(", ");
                $("#lab5").text(currentText + " " + nicks);
            } else {
                console.log("Error al intentar obtener la lista de usuarios");
            }
        });
    };

    this.comprobarSesion = function() {
        this.limpiarInterfaz()
        $("#registro").empty();
        let nick = $.cookie("nick");
        if(nick) {
            cw.mostrarMensaje("Bienvenido al sistema, "+nick)
        }
        else{
            cw.mostrarRegistro();
        }
    }

    this.limpiarInterfaz = function() {
        $("#au").empty();
        $("#au2").empty();
        $("#au3").empty();
        $("#au4").empty();
        $("#au5").empty();
        $("#au6").empty();
        $("#au7").empty();
        $("#h3").empty();
        $("#registro").empty();
    }













    this.salir=function(){
        //localStorage.removeItem("nick");
        $.removeCookie("nick");
        location.reload();
        rest.cerrarSesion();
    }
    this.cerrarSesion = function() {
        rest.cerrarSesion();
        localStorage.removeItem("nick");
        this.mostrarLogin();
    }



    this.mostrarMensaje = function(msg) {
        $("#registro").empty();
        console.log("Mensaje recibido:", msg); // Verifica el valor de msg en la consola
        let cadena = `<div><h1>${msg}</h1></div>`;
        $("#au6").append(cadena);
    };


    /*
        this.salir = function() {
            let nick = $.cookie("nick");
            $.removeCookie("nick");

            let mensaje = nick
                ? `Hasta luego, ${nick}. ¡Esperamos verte pronto!`
                : "Has cerrado sesión. ¡Vuelve pronto!";

            // Usa la misma estructura que `mostrarMensaje`
            $("#au6").html(`<div><h1>${mensaje}</h1></div>`);

            setTimeout(() => location.reload(), 2000); // Recarga después de 2 segundos
        };
        */
    this.mostrarRegistro = function() {
        $("#registro").empty();
        $("#registro").load("./cliente/registro.html", function() {
            $("#registroForm").on("submit", function(e) {
                e.preventDefault();
                let email = $("#email").val();
                let password = $("#password").val();
                if (email && password) {
                    rest.registrarUsuario(email, password);
                }
            });
        });
    };

    this.mostrarLogin = function() {
        $("#contenido").empty();
        $("#contenido").append(`
        <div id="loginForm" class="mx-auto" style="max-width: 500px;">
            <h3 class="text-center">Inicio de Sesión</h3>
            <form>
                <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" class="form-control" id="email" placeholder="Introduce tu correo electrónico" required>
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" class="form-control" id="password" placeholder="Introduce tu contraseña" required>
                </div>
                <div class="text-center">
                    <button type="submit" id="btnLogin" class="btn btn-primary">Iniciar Sesión</button>
                </div>
            </form>
        </div>`);

        $("#loginForm").on("submit", function(e) {
            e.preventDefault();
            let email = $("#email").val();
            let password = $("#password").val();
            if (email && password) {
                rest.loginUsuario({email: email, password: password});
            }
        });
    };

    this.mostrarModal=function(m){
        $("#msg").remove();
        let cadena="<div id='msg'>"+m+"</div>";
        $('#mBody').append(cadena)
        $('#miModal').modal();
        // $('#btnModal').on('click',function(){
        // })
    }

}
