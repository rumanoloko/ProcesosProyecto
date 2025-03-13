const fs=require("fs");
const express = require('express');
const app = express();
const path = require('path');
//const modelo = require("..\\ProcesosProyecto-master\\servidor\\modelo.js");
const session = require('express-session');
const passport = require("passport");
const cookieSession=require("cookie-session");
const LocalStrategy = require('passport-local').Strategy;
require("./servidor/passport-setup.js");
//require(path.join(__dirname, "servidor", "passport-setup.js"));
const modelo = require(path.join(__dirname, "servidor", "modelo.js"));
const PORT = process.env.PORT || 3000;
const bodyParser=require("body-parser");
const haIniciado=function(request,response,next){
    if (request.user){
        next();
    }
    else{
        response.redirect("/")
    }
}
let sistema = new modelo.Sistema();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/"));
app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

app.get("/agregarUsuario/:nick",function(request,response){
    let nick=request.params.nick;
    console.log(nick)
    let res=sistema.agregarUsuario(nick);
    response.send(res);
});
/*
app.get("/obtenerUsuarios",function(request,response){
    let res=[];
    Object.values(sistema.obtenerUsuarios()).forEach(usuario=>{
        res.push({nick : usuario.nick});
    })
    response.json(res);
});

 */
app.get("/obtenerUsuarios",haIniciado,function(request,response){
    let lista=sistema.obtenerUsuarios();
    response.send(lista);
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

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/fallo' }),
    function(req, res) {
        res.redirect('/good');
    }
);

app.get("/good", function(request,response){
    let email=request.user.emails[0].value;
    sistema.usuarioGoogle({"email":email},function(obj){
        response.cookie('nick',obj.email);
        response.redirect('/');
    });
});
/*
app.get("/good", function(request, response){
    let email = request.user.emails[0].value;
    if (email) {
        sistema.usuarioGoogle({"email": email}, function(obj){
            console.log(`Éxito: Usuario autenticado con email ${obj.email}`);
            response.cookie('nick', obj.email);
            response.redirect('/');
        });
    } else {
        let nick = request.user.emails[0].value;
        if (nick) {
            sistema.agregarUsuario(nick);
            console.log(`Éxito: Usuario autenticado con email ${nick}`);
            response.cookie('nick', nick);
            response.redirect('/');
        }
    }
});

 */
/*
app.get("/good", function(request,response){
    let nick=request.user.emails[0].value;
    if (nick){
        sistema.agregarUsuario(nick);
    }
    //console.log(request.user.emails[0].value);
    response.cookie('nick',nick);
    response.redirect('/');
});

 */
app.get("/fallo",function(request,response){
    console.log("Fallaste otra vez boludo de la chingada madre")
    response.send({nick:"nook"})
});
















app.post('/loginUsuario',passport.authenticate("local",{failureRedirect:
        "/fallo",successRedirect: "/ok"})
);
app.get("/ok",function(request,response){
    response.send({nick:request.user.email})
});

app.get("/", function(request,response){
    var contenido=fs.readFileSync(__dirname+"/cliente/index.html");
    response.setHeader("Content-type","text/html");
    response.send(contenido);
});

app.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
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
app.post("/registrarUsuario", function(request, response) {
    console.log("Solicitud de registro recibida para: ", request.body.email);
    sistema.registrarUsuario(request.body, function(res) {
        if (res.email !== -1) {
            console.log("Registro exitoso para: ", res.email);
        } else {
            console.log("El email ya está ocupado: ", request.body.email);
        }
        response.send({"nick": res.email});
    });
});


app.get("/confirmarUsuario/:email/:key",function(request,response){
    let email=request.params.email;
    let key=request.params.key;
    sistema.confirmarUsuario({"email":email,"key":key},function(usr){
        if (usr.email!=-1){
            response.cookie('nick',usr.email);
        }
        response.redirect('/');
    });
})
/*
app.post("/loginUsuario", function(request, response) {
    sistema.loginUsuario(request.body, function(res) {
        if (res.email != -1) {
            console.log("Inicio de sesión exitoso para: ", res.email);
            response.send({"nick": res.email});
        } else {
            console.log("Credenciales incorrectas para: ", request.body.email);
            response.send({"nick": -1});
        }
    });
});

 */
app.post('/loginUsuario',passport.authenticate("local",
    {failureRedirect:" /fallo",successRedirect: "/ok"})
);

passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},
    function(email,password,done){
        sistema.loginUsuario({"email":email,"password":password},function(user){
            return done(null,user);
        })
    }
));
app.get("/cerrarSesion",haIniciado,function(request,response){
    let nick=request.user.nick;
    request.logout();
    response.redirect("/");
    if (nick){
        sistema.eliminarUsuario(nick);
    }
});


app.use(session({
    secret: 'mi_super_secreto',  // Cambia esto por un valor seguro
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de usar `true` solo si estás en HTTPS
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







