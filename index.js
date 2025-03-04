const fs=require("fs");
const express = require('express');
const app = express();
const path = require('path');
//const modelo = require("..\\ProcesosProyecto-master\\servidor\\modelo.js");
const passport = require("passport");
const cookieSession=require("cookie-session");
require("./servidor/passport-setup.js");
//require(path.join(__dirname, "servidor", "passport-setup.js"));
const modelo = require(path.join(__dirname, "servidor", "modelo.js"));
const PORT = process.env.PORT || 3000;
const bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());

let sistema = new modelo.Sistema();

app.get("/", function(request,response){
    var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});

app.get("/agregarUsuario/:nick",function(request,response){
    let nick=request.params.nick;
    let res=sistema.agregarUsuario(nick);
    response.send(res);
});

app.get("/obtenerUsuarios",function(request,response){
    let res=[];
    Object.values(sistema.obtenerUsuarios()).forEach(usuario=>{
        res.push({nick : usuario.nick});
    })
    response.json(res);
});

app.get("/usuarioActivo/:nick",function(request,response){
    let nick=request.params.nick;
    let res=sistema.usuarioActivo(nick);
    response.json(res);
});

app.get("/numeroUsuarios", function(request, response) {
    const cantidadUsuarios = sistema.cantidadUsuarios();
    console.log("Cantidad de usuarios:", cantidadUsuarios); // Para depurar
    response.json({ cantidad: cantidadUsuarios });
});

app.get("/eliminarUsuario/:nick",function(request,response){
    let nick=request.params.nick;
    response.json({eliminado:sistema.eliminarUsuario(nick)});
});

app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

app.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/fallo' }),
    function(req, res) {
    res.redirect('/good');
});
app.get("/good", function(request,response){
    let email=request.user.emails[0].value;
    sistema.usuarioGoogle({"email":email},function(obj){
        response.cookie('nick',obj.email);
        response.redirect('/');
    });
});
app.get("/fallo",function(request,response){
    response.send({nick:"nook"})
});

app.post('/oneTap/callback',
    passport.authenticate('google-one-tap', { failureRedirect: '/fallo' }),
    function(req, res) {
// Successful authentication, redirect home.
        res.redirect('/good');
    });
app.post("/registrarUsuario",function(request,response){
    sistema.registrarUsuario(request.body,function(res){
        response.send({"nick":res.email});
    });
});

app.post('/loginUsuario', passport.authenticate("local", { failureRedirect: "/fallo", successRedirect: "/ok" }));
app.get("/ok", function(req, res) {
    res.send({ nick: req.user.email });
});





