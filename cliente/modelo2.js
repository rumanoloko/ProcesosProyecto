// const os = require("./cad.js");
// const correo = require("./email.js");
// const bcrypt = require('bcrypt');  // Comentamos esta línea ya que `require` no está definido en el navegador
const saltRounds = 10;

function Partida(codigo) {
    this.codigo = codigo;
    this.jugadores = [];
    this.maxJug = 2;
}

function Sistema() {
    this.usuarios = [];
    this.partidas = []; // Añadimos una colección de partidas

    this.usuarioGoogle = function(usr, callback) {
        // Lógica para usuario Google
    };

    this.agregarUsuario = function(usuario) {
        let res = { "nick": -1 };
        if (!this.usuarios[usuario.nick]) {
            this.usuarios[usuario.nick] = usuario;
            res.nick = usuario.nick;
        } else {
            console.log("el nick " + usuario.nick + " está en uso");
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

    // Implementamos el método obtenerCodigo()
    this.obtenerCodigo = function() {
        return (Math.random().toString(36).substr(2, 9)).toUpperCase();
    };

    // Implementamos el método crearPartida(email)
    this.crearPartida = function(email) {
        let usuario = Object.values(this.usuarios).find(u => u.nick === email || u.email === email);
        if (usuario) {
            let codigo = this.obtenerCodigo();
            let partida = new Partida(codigo);
            partida.jugadores.push(usuario);
            this.partidas[codigo] = partida;
            return codigo;
        }
        return -1;
    };

    // Implementamos el método unirAPartida(email, codigo)
    this.unirAPartida = function(email, codigo) {
        let usuario = Object.values(this.usuarios).find(u => u.nick === email || u.email === email);
        let partida = this.partidas[codigo];
        if (usuario && partida && partida.jugadores.length < partida.maxJug) {
            partida.jugadores.push(usuario);
            return true;
        }
        return false;
    };

    this.obtenerPartidasDisponibles = function() {
        let lista = [];
        for (let codigo in this.partidas) {
            let partida = this.partidas[codigo];
            if (partida.jugadores.length < partida.maxJug) {
                lista.push({ creador: partida.jugadores[0].nick, codigo: partida.codigo });
            }
        }
        return lista;
    };

    this.buscarUsuario = function(obj, callback) {
        buscar(this.usuarios, obj, callback);
    };

    this.insertarUsuario = function(usuario, callback) {
        insertar(this.usuarios, usuario, callback);
    };

    this.registrarUsuario = function(obj, callback) {
        let modelo = this;
        if (!obj.nick) {
            obj.nick = obj.email;
        }
        // Lógica para registrar usuario
    };

    function buscar(coleccion, criterio, callback) {
        // Lógica para buscar en la colección
    }

    function insertar(coleccion, elemento, callback) {
        // Lógica para insertar en la colección
    }

    this.loginUsuario = function(obj, callback) {
        // Lógica para login de usuario
    };

    this.confirmarUsuario = function(obj, callback) {
        // Lógica para confirmar usuario
    };
}

function Usuario(nick) {
    this.nick = nick;
}

// module.exports.Sistema = Sistema;
