function ClienteWS() {
    this.socket = undefined;
    this.email = ""; // Asegúrate de que esto se asigne correctamente después de iniciar sesión
    this.partidasRecibidas = []
    this.ini = function() {
        this.socket = io.connect();

        // Evento de conexión
        this.socket.on('connect', function() {
            console.log("Conectado al servidor WebSocket");
        });

        // Evento de desconexión
        this.socket.on('disconnect', function() {
            console.log("Desconectado del servidor WebSocket");
        });

        this.socket.on("unidoAPartida", function(datos) {
            console.log("Unido a la partida con código: " + datos.codigo);
            cw.mostrarMensaje("Unido a la partida con código: " + datos.codigo);
        });

        this.socket.on("errorUnirsePartida", function(datos) {
            console.error(datos.mensaje);
            cw.mostrarModal("Error: " + datos.mensaje);
        });

        this.socket.on("partidaCreada", function(datos) {
            console.log("Partida creada con código:", datos.codigo);
            cw.mostrarMensaje("Esperando rival para la partida con código: " + datos.codigo);
        });

        this.socket.on("listaPartidas", function(lista) {
            console.log("Lista de partidas recibida:", lista);
            if(lista) {
                this.partidasRecibidas = lista;
            }
            console.log(this.partidasRecibidas);
            cw.mostrarListaPartidas(lista); // Actualiza la interfaz gráfica con las partidas disponibles
        });


    };
    this.obtenerListaPartidas = function() {
        this.socket.emit("obtenerListaPartidas"); // Solicita al servidor la lista de partidas
    };

    this.crearPartida = function() {
        this.socket.emit("crearPartida", { email: this.email });
    };

    this.unirAPartida = function(codigo) {
        this.socket.emit("unirAPartida", { email: this.email, codigo: codigo });
    };

    this.setEmail = function(email) {
        this.email = email;
    };

    this.ini();
}


