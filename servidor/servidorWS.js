// Definición del objeto WSServer
function WSServer() {
    // Método para lanzar el servidor WebSocket
    this.lanzarServidor = function(io, sistema, srv) {
        console.log("Intentando conectarse..........");
        io.on('connection', function(socket) {
            console.log("Capa WS activa");

            // Manejar desconexión
            socket.on('disconnect', function() {
                console.log("Cliente desconectado");
            });

            // Evento: crear partida
            socket.on("crearPartida", function(datos) {
                if (!datos.email) {
                    srv.enviarAlRemitente(socket, "error", { mensaje: "Email inválido" });
                    return;
                }

                let codigo = sistema.crearPartida(datos.email);
                if (codigo !== -1) {
                    socket.join(codigo); // El usuario se une al socket de la partida
                    srv.enviarAlRemitente(socket, "partidaCreada", { codigo: codigo });
                    let lista = sistema.obtenerPartidasDisponibles();
                    srv.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
                } else {
                    srv.enviarAlRemitente(socket, "error", { mensaje: "No se pudo crear la partida" });
                }
            });

            // Evento: unirse a partida
            socket.on("unirAPartida", function(datos) {
                if (!datos.email || !datos.codigo) {
                    srv.enviarAlRemitente(socket, "error", { mensaje: "Datos incompletos" });
                    return;
                }
                let resultado = sistema.unirAPartida(datos.email, datos.codigo);
                if (resultado) {
                    socket.join(datos.codigo);
                    srv.enviarAlRemitente(socket, "unidoAPartida", { codigo: datos.codigo });
                    let lista = sistema.obtenerPartidasDisponibles();
                    srv.enviarATodosMenosRemitente(socket, "listaPartidas", lista);
                } else {
                    srv.enviarAlRemitente(socket, "error", { mensaje: "No se pudo unir a la partida" });
                }
            });

            socket.on("obtenerListaPartidas", function() {
                let lista = sistema.obtenerPartidasDisponibles(); // Llama al método lógico
                srv.enviarAlRemitente(socket, "listaPartidas", lista); // Envía la lista al cliente
            });

        });
    };

    // Métodos para gestionar comunicación
    this.enviarAlRemitente = function(socket, mensaje, datos) {
        socket.emit(mensaje, datos);
    };

    this.enviarATodosMenosRemitente = function(socket, mens, datos) {
        socket.broadcast.emit(mens, datos);
    };

    this.enviarGlobal = function(io, mens, datos) {
        io.emit(mens, datos);
    };
}
// Exportar el objeto WSServer
module.exports.WSServer = WSServer;
