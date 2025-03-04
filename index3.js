const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const modelo = require(path.join(__dirname, "servidor", "modelo.js"));
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde la carpeta cliente
app.use(express.static(path.join(__dirname, "cliente")));

// Crear una instancia del sistema
let sistema = new modelo.Sistema();

// Ruta principal
app.get("/", function (request, response) {
    const indexPath = path.join(__dirname, "cliente", "index.html");

    if (!fs.existsSync(indexPath)) {
        return response.status(404).send("Archivo index.html no encontrado");
    }

    const contenido = fs.readFileSync(indexPath);
    response.setHeader("Content-Type", "text/html");
    response.send(contenido);
});

// Agregar usuario
app.get("/agregarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.agregarUsuario(nick);
    response.send(res);
});

// Obtener lista de usuarios
app.get("/obtenerUsuarios", function (request, response) {
    let res = [];
    Object.values(sistema.obtenerUsuarios()).forEach(usuario => {
        res.push({ nick: usuario.nick });
    });
    response.json(res);
});

// Verificar si un usuario está activo
app.get("/usuarioActivo/:nick", function (request, response) {
    let nick = request.params.nick;
    let res = sistema.usuarioActivo(nick);
    response.json(res);
});

// Obtener número total de usuarios
app.get("/numeroUsuarios", function (request, response) {
    const cantidadUsuarios = sistema.cantidadUsuarios();
    console.log("Cantidad de usuarios:", cantidadUsuarios);
    response.json({ cantidad: cantidadUsuarios });
});

// Eliminar usuario
app.get("/eliminarUsuario/:nick", function (request, response) {
    let nick = request.params.nick;
    response.json({ eliminado: sistema.eliminarUsuario(nick) });
});

// Iniciar el servidor en 0.0.0.0 para compatibilidad con Google Cloud Run
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
    console.log("Presiona Ctrl+C para detener el servidor");
});
