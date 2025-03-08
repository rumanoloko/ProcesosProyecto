const modelo = require("./modelo.js");
describe('El sistema...', function() {
    let sistema;

    beforeEach(function() {
        sistema=new modelo.Sistema();
        sistema.agregarUsuario('Petru');
        sistema.agregarUsuario('Pyotr');
        sistema.agregarUsuario('Vlad');
        sistema.agregarUsuario('Vladislav');
    });

    it('comprobar que no hay usuarios al inicio', function() {
        expect(sistema.cantidadUsuarios()).toEqual({"cantidadUsuarios" : 4});
    });

    it('agregar un usuario', function() {
        sistema.eliminarUsuario("Petru");
        expect(sistema.usuarioActivo("Petru")).toEqual(false);
    });

    it('comprobar que el usuario creado está en el sistema', function() {
        sistema.agregarUsuario('Juan');
        expect(sistema.usuarioActivo('Juan')).toBe(true);
    });

    it('obtener lista de usuarios', function() {
        //let usuariosEsperados = {'juan': new modelo('juan')};
        //sistema.agregarUsuario("Petru");
        // Comparamos los nicks en lugar de los objetos completos
        expect(sistema.obtenerUsuarios()).toEqual([{ nick : 'Petru' }, { nick : 'Pyotr' }, { nick : 'Vlad' }, { nick : 'Vladislav' } ]);
    });

    it('eliminar usuario', function() {
        sistema.agregarUsuario('Petru')
        expect(sistema.usuarioActivo('Petru')).toEqual(true);
        expect(sistema.eliminarUsuario('Petru')).toEqual(true);
    });

    it('comprobar que el usuario eliminado no está en el sistema', function() {
        sistema.eliminarUsuario('juan');
        expect(sistema.usuarioActivo('juan')).toBe(false);
    });
});
