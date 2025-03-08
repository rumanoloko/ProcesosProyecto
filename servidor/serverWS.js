function WSserver(io){
    this.lanzarServer=function(io,sistema){
        io.on('connection',function(socket){
                console.log("Capa WS activa");
            }
        );
    }
}
module.exports.WSServer=WSserver;