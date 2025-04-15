function ControlWeb() {

    this.init=function(){
        let cw=this;
        google.accounts.id.initialize({
            client_id:"593170222026-hl59nasvk5e766r4g2e8jmbmn2dtf8ah.apps.googleusercontent.com",
            auto_select:false,
            callback:cw.handleCredentialsResponse
        });
        google.accounts.id.prompt();
        this.handleCredentialsResponse=function(response){
            let jwt=response.credential;
            //let user=JSON.parse(atob(jwt.split(".")[1]));
            //console.log(user.name);
            //console.log(user.email);
            //console.log(user.picture);
            rest.enviarJwt(jwt);
        }
    }

    this.mostrarCrearPartida = function() {
        $("#au").empty();
        $("#au2").empty();
        $("#au3").empty();
        $("#au4").empty();
        $("#au5").empty();
        $("#au7").empty();
        $("#h3").empty();
        $("#g_id_onload").empty();
        $("#registro").empty();
        $("#login").empty();
        $("#listaPartidas").empty();
        let cadena = `
        <div id="crearPartida" class="form-group text-center">
            <button id="btnCrearPartida" class="btn btn-primary">Crear Partida</button>
            <div id="esperandoRival" style="display:none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <p>Esperando rival...</p>
                <img src="./cliente/img/loading.gif" alt="Esperando rival">
            </div>
        </div>`;
        $("#au7").append(cadena);

        $("#btnCrearPartida").on("click", function() {
            $("#btnCrearPartida").hide(); // Oculta el botón
            $("#esperandoRival").show(); // Muestra la animación de espera
            ws.crearPartida(); // Envía la solicitud para crear la partida
        });
    };


    this.mostrarListaPartidas2 = function(lista) {
        this.limpiarInterfaz();
        $("#au2").empty();
        let cadena = `
            <div id="listaPartidas" class="form-group">
                <h3>Partidas Disponibles</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>`;
                lista.forEach(partida => {
                    cadena += `
                        <tr>
                            <td>${partida.codigo}</td>
                            <td><button class="btn btn-success unirsePartida" data-codigo="${partida.codigo}">Unirse</button></td>
                        </tr>`;
                });
                cadena += `
                    </tbody>
                </table>
            </div>`;
        $("#au2").append(cadena);

        $(".unirsePartida").on("click", function() {
            let codigo = $(this).data("codigo");
            ws.unirAPartida(codigo); // Envía la solicitud para unirse a la partida
        });
    };


    this.mostrarAgregarUsuario = function() {
        this.limpiarInterfaz()
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

    this.mostrarListaPartidas = function(lista) {
        this.limpiarInterfaz(); // Limpia la interfaz antes de mostrar la lista
        console.log("Mostrando lista de partidas...");

        // Validar que 'lista' es un array válido
        if (!Array.isArray(lista)) {
            console.error("La variable lista no es un array o es undefined:", lista);
            return;
        }

        let listaElement = document.getElementById("listaPartidas");
        if (!listaElement) {
            console.error("Error: Contenedor 'listaPartidas' no encontrado.");
            return;
        }

        //listaElement.innerHTML = "";

        // Iterar por cada objeto en la lista y crear un botón con el código de la partida
        lista.forEach(function(partida) {
            // Crear un elemento botón
            let button = document.createElement("button");
            button.textContent = partida.codigo; // El texto del botón es el código de la partida
            button.className = "btn btn-primary m-2"; // Opcional: Estilo para los botones

            // Agregar el evento clic para intentar unirse a la partida
            button.addEventListener("click", function() {
                console.log("Intentando unirse a la partida con código:", partida.codigo);
                ws.unirAPartida(partida.codigo); // Llama a la función para unirse a la partida
            });

            listaElement.appendChild(button);
        });

        console.log("Lista de botones mostrada correctamente:", lista.map(partida => partida.codigo));
    };








    this.mostrarNumeroUsuarios = function() {
        this.limpiarInterfaz()
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
        this.limpiarInterfaz()
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
        this.limpiarInterfaz()
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
        this.limpiarInterfaz()
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
        $("#g_id_onload").empty();
        $("#registro").empty();
        $("#login").empty();
        $("#listaPartidas").empty();
    }

    this.salir=function(){
        //localStorage.removeItem("nick");
        $.removeCookie("nick");
        location.reload();
        rest.cerrarSesion();
    }
    this.cerrarSesion = function() {
        this.limpiarInterfaz()
        rest.cerrarSesion();
        localStorage.removeItem("nick");
        this.mostrarLogin();
    }

    this.mostrarMensaje = function(msg) {
        //this.limpiarInterfaz()
        $("#registro").empty();
        console.log("Mensaje recibido:", msg); // Verifica el valor de msg en la consola
        let cadena = `<div class="text-center"><h3>${msg}</h3></div>`;
        $("#au6").empty();
        $("#au6").append(cadena);
        //this.mostrarCrearPartida();
    };
    this.mostrarMensaje2 = function(msg) {
        //this.limpiarInterfaz()
        //$("#registro").empty();
        console.log("Mensaje recibido:", msg); // Verifica el valor de msg en la consola
        let cadena = `<div class="text-center"><h3>${msg}</h3></div>`;
        $("#au6").empty();
        $("#au6").append(cadena);
        //this.mostrarCrearPartida();
    };

    this.mostrarRegistro = function() {
        this.limpiarInterfaz();
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
        this.limpiarInterfaz()
        $("#login").append(`
        <div id="loginForm" class="mx-auto" style="max-width: 500px;">
            <h3 class="text-center">Inicio de Sesión</h3>
            <form>
                <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input type="email" class="form-control" id="email" placeholder="Introduce tu correo electrónico" required value="pasatpetruvlad@gmail.com">
                </div>
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <input type="password" class="form-control" id="password" placeholder="Introduce tu contraseña" required value="peter_0114">
                </div>
                <div class="text-center">
                    <button type="submit" id="btnLogin" class="btn btn-primary">Iniciar Sesión</button>
                </div>
            </form>
            <div class="text-center">
                <a href="/auth/google">
                    <img src="./cliente/img/google_signin_web.png" alt="imagen de inicio de sesión de google" style="height:40px;">
                </a>
            </div>
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
