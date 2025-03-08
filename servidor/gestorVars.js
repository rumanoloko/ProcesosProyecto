const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Crear instancia de SecretManagerServiceClient
const client = new SecretManagerServiceClient();



//CAMBIAR LO DE NUMEROPROYECTO

// Función para acceder a la nueva clave secreta de correo electrónico
async function accessCorreoElectronico() {
    const nombre = 'projects/moonlit-text-402117/secrets/CORREO_GMAIL/versions/1';
    const [version] = await client.accessSecretVersion({
        name: nombre,
    });
    const correo = version.payload.data.toString('utf8');
    return correo;
}

// Función para acceder a la clave CLAVECORREO
async function accessCLAVECORREO() {
    const nombre = 'projects/moonlit-text-402117/secrets/CLAVECORREO/versions/1';
    const [version] = await client.accessSecretVersion({
        name: nombre,
    });
    const datos = version.payload.data.toString('utf8');
    return datos;
}

module.exports.obtenerOptions = async function(callback) {
    let options = { user: "", pass: "" };
    let user = await accessCorreoGmail(); // Obtener el correo electrónico de autenticación de Gmail
    let pass = await accessCLAVECORREO(); // Obtener la clave secreta
    options.user = user; // Asignar el correo electrónico a options.user
    options.pass = pass; // Asignar la clave secreta a options.pass
    callback(options);
}