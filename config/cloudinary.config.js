// cloudinary.config.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // ej.: "mi_cloud"
  api_key: process.env.CLOUDINARY_API_KEY,       // tu API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // tu API secret
});

/**
 * Función para subir un archivo a Cloudinary.
 * @param {Buffer} fileBuffer - El buffer del archivo a subir.
 * @param {String} folder - (Opcional) Carpeta en Cloudinary donde se almacenará.
 * @returns {Promise} - Resolviendo con el resultado de la carga.
 */
const uploadFile = (fileBuffer, folder = 'projects') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

module.exports = { cloudinary, uploadFile };
