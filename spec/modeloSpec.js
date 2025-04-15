const modelo = require("../servidor/modelo.js");

describe('El sistema...', function() {
    let sistema;
    beforeEach(function() {
        sistema = new modelo.Sistema();
        sistema.agregarUsuario('Petru');
        sistema.agregarUsuario('Pyotr');
        sistema.agregarUsuario('Vlad');
        sistema.agregarUsuario('Vladislav');
    });

    it('comprobar que hay usuarios al inicio', function() {
        expect(sistema.cantidadUsuarios()).toEqual(4);
    });

    it('eliminar un usuario', function() {
        sistema.eliminarUsuario("Petru");
        expect(sistema.usuarioActivo("Petru")).toEqual(false);
    });

    it('comprobar que el usuario creado está en el sistema', function() {
        sistema.agregarUsuario('Juan');
        expect(sistema.usuarioActivo('Juan')).toBe(true);
    });

    it('obtener lista de usuarios', function() {
        const nicks = sistema.obtenerUsuarios().map(u => u.nick);
        expect(nicks).toEqual(['Petru', 'Pyotr', 'Vlad', 'Vladislav']);
    });

    it('eliminar usuario', function() {
        expect(sistema.usuarioActivo('Petru')).toEqual(true);
        expect(sistema.eliminarUsuario('Petru')).toEqual(true);
    });

    it('comprobar que el usuario eliminado no está en el sistema', function() {
        sistema.eliminarUsuario('Juan');
        expect(sistema.usuarioActivo('Juan')).toBe(false);
    });

    // Pruebas de las partidas
    describe('Pruebas de las partidas', function() {
        let usr2;
        let usr3;

        beforeEach(function() {
            usr2 = new modelo.Usuario("Pepa");
            usr3 = new modelo.Usuario("Pepo");
            sistema.agregarUsuario(usr2.nick);
            sistema.agregarUsuario(usr3.nick);
        });

        it('Usuarios y partidas en el sistema', function() {
            expect(sistema.cantidadUsuarios()).toEqual(6); // 4 originales + 2 nuevos
            expect(sistema.obtenerPartidasDisponibles().length).toEqual(0);
        });

        it('Crear partida', function() {
            let codigo = sistema.crearPartida("Petru");
            expect(codigo).not.toEqual(-1);
            expect(sistema.partidas[codigo].jugadores[0].nick).toEqual("Petru");
        });

        it('Unir a partida', function() {
            let codigo = sistema.crearPartida("Petru");
            let resultado = sistema.unirAPartida("Pyotr", codigo);
            expect(resultado).toBeTrue();
            expect(sistema.partidas[codigo].jugadores.length).toEqual(2);
        });

        it('Un usuario no puede estar dos veces', function() {
            let codigo = sistema.crearPartida("Petru");
            sistema.unirAPartida("Pyotr", codigo);
            let resultado = sistema.unirAPartida("Pyotr", codigo);
            expect(resultado).toBeFalse();
        });

        it('Obtener partidas', function() {
            let codigo = sistema.crearPartida("Petru");
            let lista = sistema.obtenerPartidasDisponibles();
            expect(lista.length).toEqual(1);
            expect(lista[0].creador).toEqual("Petru");
        });
    });
});
