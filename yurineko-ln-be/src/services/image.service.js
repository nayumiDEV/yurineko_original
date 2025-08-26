const sharp = require('sharp');
const { InternalServerError } = require('../utils/response');
const fs = require('fs-extra');

const imageConfig = {
    quality: 90,
    chromaSubsampling: '4:4:4',
    force: true
}

/** 
 * Compress and store image in Buffer to path given in params
 *
 * @param {Buffer} image Buffer of the input image
 * @param {String} path New path of the upload image
 */
const compressImage = (image, path) =>
    new Promise((resolve, reject) => {
        // Ensure that the filepath is exists (create a dummy file at the path)
        // Or the program will be crash unexpectedly!
        fs.ensureFileSync(path);
        // reject(new InternalServerError(path))
        // Image compressing and converting input to JPEG!
        sharp(image)
            .jpeg(imageConfig)
            .toFile(path, (err, info) => {
                if (err) {
                    reject(new InternalServerError("Có lỗi xảy ra trong quá trình xử lý ảnh! Vui lòng thử lại hoặc liên hệ Admin để báo lỗi!"));
                }
                else {
                    resolve();
                }
            })
    })

module.exports = {
    compress: compressImage
}