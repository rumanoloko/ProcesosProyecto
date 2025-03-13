const nodemailer = require('nodemailer');
const url="http://localhost:3000/";
const gv = require('./gestorVariables.js');
//const url="tu-url-de-despliegue";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pasatpetruvlad@gmail.com',
        pass: 'dejq ukei qzhm pptj'
    }
});

//send();

module.exports.enviarEmail=async function(direccion, key,men) {
    const result = await transporter.sendMail({
        from: 'pasatpetruvlad@gmail.com',
        to: direccion,
        subject: men,
        text: 'Pulsa aquí para confirmar cuenta',
        html: '<p>Bienvenido a Sistema</p><p><a href="'+url+'confirmarUsuario/'+direccion+'/'+key+'">Pulsa aquí para confirmar cuenta</a></p>'
});
}
/*
let options = {
    user: "tu-correo@gmail.com",
    pass: "" // clave secreta
}
//const transporter;
let transporter;
gv.obtenerOptions(function(res){
    options = res;
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: options
    });
});

 */
