const nodemailer = require('nodemailer');
const url = "http://localhost:3000/";
const gv = require('./gestorVariables.js');
// const url = "tu-url-de-despliegue";

let transporter;

async function configurarTransporter() {
    let options = await gv.obtenerOptions();
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: options.user,
            pass: options.pass
        }
    });
}

// Condición para verificar si estamos en modo pruebas
if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'test') {
    configurarTransporter();
}

module.exports.enviarEmail = async function(direccion, key, men) {
    if (!transporter) {
        await configurarTransporter();
    }
    const result = await transporter.sendMail({
        from: 'pasatpetruvlad@gmail.com',
        to: direccion,
        subject: men,
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="' + url + 'confirmarUsuario/' + direccion + '/' + key + '">Pulsa aquí para confirmar cuenta</a></p>'
    });
}
