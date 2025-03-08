const nodemailer = require('nodemailer');
const url="http://localhost:3000/";
const gv = require('./gestorVars.js');
//const url="tu-url-de-despliegue";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pasatpetruvlad@gmail.com',
        pass: '0522 1582'
    }
});

//send();

module.exports.enviarEmail=async function(direccion, key,men) {
    const result = await transporter.sendMail({
        from: 'tu-cuenta@gmail.com',
        to: direccion,
        subject: men,
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
    });
    console.log(JSON.stringify(result, null, 4));
}