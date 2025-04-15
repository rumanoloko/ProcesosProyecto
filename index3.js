const fs = require("fs");
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const passport = require("passport");
const cookieSession = require("cookie-session");
const LocalStrategy = require('passport-local').Strategy;
require("./servidor/passport-setup.js");
const modelo = require(path.join(__dirname, "servidor", "modelo2.js"));
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");

const httpServer = require('http').Server(app);
const { Server } = require("socket.io");
const moduloWS = require("./servidor/servidorWS.js");
let ws = new moduloWS.WSServer();
let io = new Server();
httpServer.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});
io.listen(httpServer);
ws.lanzarServidor(io);

const haIniciado = function(request, response, next) {
    if (request.user) {
        next();
    } else {
        response.redirect("/")
    }
}
let sistema = new modelo.Sistema();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get("/agregarUsuario/:nick", function(request, response) {
    let nick = request.params.nick;
    console.log(nick)
    let res = sistema.agregarUsuario(nick);
    response.send(res);
});

app.get("/obtenerUsuarios", haIniciado, function(request, response) {
    let lista = sistema.obtenerUsuarios();
    response.send(lista);
});

app.get("/usuarioActivo/:nick", function(request, response) {
    let nick = request.params.nick;
    let res = sistema.usuarioActivo(nick);
    response.json(res);
});

app.get("/numeroUsuarios", function(request, response) {
    const cantidadUsuarios = sistema.cantidadUsuarios();
    console.log("Cantidad de usuarios:", cantidadUsuarios);
    response.json({ cantidad: cantidadUsuarios });
});

app.get("/eliminarUsuario/:nick", function(request, response) {
    let nick = request.params.nick;
    response.json({ eliminado: sistema.eliminarUsuario(nick) });
});

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fallo' }),
    function(req, res) {
        res.redirect('/good');
    }
);

app.get("/good", function(request, response) {
    let email = request.user.emails[0].value;
    sistema.usuarioGoogle({ "email": email }, function(obj) {
        response.cookie('nick', obj.email);
        response.redirect('/');
    });
});

app.get("/fallo", function(request, response) {
    console.log("Fallaste otra vez boludo de la chingada madre");
    response.send({ nick: "nook" });
});

app.post('/loginUsuario', passport.authenticate("local", { failureRedirect: "/fallo", successRedirect: "/ok" }));
app.get("/ok", function(request, response) {
    response.send({ nick: request.user.email });
});

app.get("/", function(request, response) {
    var contenido = fs.readFileSync(__dirname + "/cliente/index.html");
    response.setHeader("Content-type", "text/html");
    response.send(contenido);
});

app.get("/cerrarSesion", haIniciado, function(request, response) {
    let nick = request.user.nick;
    request.logout();
    response.redirect("/");
    if (nick) {
        sistema.eliminarUsuario(nick);
    }
});

app.use(session({
    secret: 'mi_super_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get("/cerrarSesion", function(request, response) {
    if (request.isAuthenticated()) {
        let nick = request.user.nick;
        request.logout(function(err) {
            if (err) {
                console.log("Error al cerrar sesión: ", err);
                return response.status(500).send("Error al cerrar sesión");
            }
            console.log("Sesión cerrada para: ", nick);
            response.redirect("/");
        });
    } else {
        response.redirect("/");
    }
});
