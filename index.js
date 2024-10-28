const fs=require("fs");
const express = require('express');
const app = express();
const modelo = require("C:/Users/Vlad/WebstormProjects/ProcesosProyecto/servidor/modelo.js");
const PORT = process.env.PORT || 3000;


app.use(express.static(__dirname + "/"));
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

app.listen(PORT, () => {
    console.log(`App está escuchando en el puerto ${PORT}`);
    console.log('Ctrl+C para salir');
});



