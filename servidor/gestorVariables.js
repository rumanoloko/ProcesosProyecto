const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function accessNOMBRECORREO() {
    const name = 'projects/proven-wavelet-449518-q4/secrets/nombreCorreo/versions/1';
    const [version] = await client.accessSecretVersion({
        name: name,
    });
    const datos = version.payload.data.toString("utf8");
    return datos;
}

async function accessCLAVECORREO() {
    const name = 'projects/proven-wavelet-449518-q4/secrets/claveCorreo/versions/1';
    const [version] = await client.accessSecretVersion({
        name: name,
    });
    const datos = version.payload.data.toString("utf8");
    return datos;
}
async function accessMONGOATLASURL() {
    const name = 'projects/proven-wavelet-449518-q4/secrets/mongodbURL/versions/1';
    const [version] = await client.accessSecretVersion({
        name: name,
    });
    const datos = version.payload.data.toString("utf8");
    return datos;
}

module.exports.obtenerOptions = async function(callback) {
    let options = { user: "", pass: "" };
    try {
        let user = await accessNOMBRECORREO(); // Obtener el correo electrónico de autenticación de Gmail
        let pass = await accessCLAVECORREO(); // Obtener la clave secreta
        let mongourl = await accessMONGOATLASURL();
        options.user = user; // Asignar el correo electrónico a options.user
        options.pass = pass; // Asignar la clave secreta a options.pass
        console.log('Correo:', user); // Mostrar el correo electrónico
        console.log('Clave:', pass); // Mostrar la clave secreta
        console.log('MongoAtlasURL:', mongourl); // Mostrar la clave secreta
        callback(options);
    } catch (error) {
        console.error('Error al obtener las opciones:', error);
    }
}

// Ejemplo de cómo usar obtenerOptions
module.exports.obtenerOptions((options) => {
    console.log('Options:', options);
});
/*
module.exports.obtenerOptions= async function(callback){
    let options={user:"",pass:""};
    let user = await accessCLAVECORREO();
    options.pass = pass;
    callback(options);
}
 */