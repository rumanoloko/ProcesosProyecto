const datos = require("./cad.js");
const correo = require("./email.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

function Partida(codigo) {
    this.codigo = codigo;
    this.jugadores = [];
    this.maxJug = 2;
}

function Sistema() {
    this.usuarios = {};
    this.partidas = [];
    this.cad = new datos.CAD();
    this.cad.conectar(function(db) {
        console.log("Conectado a Mongo Atlas");
    });

    this.usuarioGoogle = function(usr, callback) {
        this.cad.buscarOCrearUsuario(usr, function(obj) {
            callback(obj);
        });
        this.cad.registrarLog("inicioGoogle", usr.email).catch(console.error); // Registro de actividad
    };

    this.agregarUsuario = function(nick) {
        let res = { "nick": -1 };
        if (!this.usuarios[nick]) {
            this.usuarios[nick] = new Usuario(nick);
            res.nick = nick;
        } else {
            console.log("el nick " + nick + " está en uso");
        }
        return res;
    };

    this.eliminarUsuario = (nick) => {
        return this.usuarios[nick] ? (delete this.usuarios[nick], true) : false;
    };

    this.usuarioActivo = (nick) => {
        return this.usuarios[nick] ? true : false;
    };

    this.obtenerUsuarios = () => {
        return Object.values(this.usuarios);
    };

    this.cantidadUsuarios = () => {
        return Object.keys(this.usuarios).length;
    };

    this.registrarUsuario = function(obj, callback) {
        let modelo = this;
        if (!obj.nick) {
            obj.nick = obj.email;
        }
        this.cad.buscarUsuario(obj, function(usr) {
            if (!usr) {
                obj.key = Date.now().toString();
                obj.confirmada = false;
                modelo.cad.insertarUsuario(obj, function(res) {
                    callback(res);
                });
                modelo.cad.registrarLog("registroUsuario", obj.email).catch(console.error); // Registro de actividad
                correo.enviarEmail(obj.email, obj.key, "Confirmar cuenta");
            } else {
                callback({ "email": -1 });
            }
        });
    };

    this.loginUsuario = function(obj, callback) {
        let modelo = this;
        this.cad.buscarUsuario({ "email": obj.email, "confirmada": true }, function(usr) {
            if (usr && usr.password == obj.password) {
                modelo.usuarios[obj.email] = new Usuario(obj.email);
                callback(usr);
                modelo.cad.registrarLog("inicioLocal", obj.email).catch(console.error); // Registro de actividad
            } else {
                callback({ "email": -1 });
            }
        });
    };

    this.confirmarUsuario = function(obj, callback) {
        let modelo = this;
        this.cad.buscarUsuario({ "email": obj.email, "confirmada": false, "key": obj.key }, function(usr) {
            if (usr) {
                usr.confirmada = true;
                modelo.cad.actualizarUsuario(usr, function(res) {
                    callback({ "email": res.email });
                });
                modelo.cad.registrarLog("registroUsuario", obj.email).catch(console.error); // Registro de actividad
            } else {
                callback({ "email": -1 });
            }
        });
    };

    this.obtenerCodigo = function() {
        return (Math.random().toString(36).substr(2, 9)).toUpperCase();
    };

    this.crearPartida = function(email) {
        let usuario = Object.values(this.usuarios).find(u => u.nick === email);
        if (usuario) {
            let codigo = this.obtenerCodigo();
            let partida = new Partida(codigo);
            partida.jugadores.push(usuario);
            this.partidas[codigo] = partida;

            this.cad.registrarLog("crearPartida", email).catch(console.error); // Registro de actividad
            return codigo;
        }
        return -1;
    };

    this.unirAPartida = function(email, codigo) {
        let usuario = this.usuarios[email];
        let partida = this.partidas[codigo];

        if (usuario && partida && partida.jugadores.length < partida.maxJug) {
            partida.jugadores.push(usuario);
            this.cad.registrarLog("unirAPartida", email).catch(console.error); // Registro de actividad
            return codigo;
        }
        return -1; // Indicar que no se pudo unir a la partida
    };

    this.cerrarSesion = function(email) {
        if (this.usuarios[email]) {
            delete this.usuarios[email];
            this.cad.registrarLog("cerrarSesion", email).catch(console.error); // Registro de actividad
            return true;
        }
        return false;
    };

    this.obtenerPartidasDisponibles = function() {
        let lista = [];
        for (let codigo in this.partidas) {
            let partida = this.partidas[codigo];
            //console.log(partida);
            if (partida.jugadores.length < partida.maxJug) {
                lista.push({ creador: partida.jugadores[0].nick, codigo: partida.codigo });
            }
        }
        return lista;
    };
}

function Usuario(nick) {
    this.nick = nick;
}

module.exports.Sistema = Sistema;
module.exports.Partida = Partida;
module.exports.Usuario = Usuario;
