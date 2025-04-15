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

module.exports.obtenerOptions = async function() {
    let options = { user: "", pass: "" };
    try {
        options.user = await accessNOMBRECORREO(); // Obtener el correo electrónico de autenticación de Gmail
        options.pass = await accessCLAVECORREO(); // Obtener la clave secreta
    } catch (error) {
        console.error('Error al obtener las opciones:', error);
    }
    return options;
}
