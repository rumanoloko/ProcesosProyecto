function ControlWeb() {
    this.mostrarAgregarUsuario = function() {
        let cadena = '<div id="mAU" class="form-group">';
        cadena += '<label for="nick">Nombre:</label>';
        cadena += '<input type="text" class="form-control" id="nick">';
        cadena += '<button id="btnAU" type="submit" class="btn btn-primary">Agregar</button>';
        cadena += '</div>';
        $("#au").append(cadena);
        $("#btnAU").on("click", function(){
            let nick = $("#nick").val();
            /*if(nick){
                $("#mAU").remove();
            }*/
            rest.agregarUsuario2(nick);
        })
    }

    this.mostrarNumeroUsuarios = function() {
        $("#nui").remove();
        let cadena = '<div class="form-group" id="nui">';
        cadena += '<label id="lab" for="nick">Numero de Usuarios: </label>'; // Asigna un id="lab" al label
        cadena += '</div>';

        $("#au2").append(cadena);

        rest.numeroUsuarios(function(data) {
            if (data) {
                let currentText = $("#lab").text(); // Obtener el texto actual del label
                $("#lab").text(currentText + data.cantidad);
            } else {
                console.log("Error al obtener la cantidad de usuarios");
            }
        });
    };

    this.mostrarUsuarioActivo = function() {
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
        $("#nui5").remove();
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
}
