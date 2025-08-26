const config = require('../configs/env');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const { InternalServerError, BadRequest } = require('./response');
const { AWS_S3_HOST_NAME, CLOUDFLARE_ZONE_ID, CLOUDFLARE_EMAIL, CLOUDFLARE_API_KEY } = require('../configs/env');
const { default: axios } = require('axios');
const { min, max } = require('lodash');
const { AsyncCatch } = require('./utilities');
const fs = require('fs-extra');

const s3 = new AWS.S3({
    accessKeyId: config.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_S3_SECRET_ACCESS_KEY,
    region: config.AWS_S3_REGION
});

const imageConfig = {
    quality: 90,
    chromaSubsampling: '4:4:4',
    force: true
}

/** 
 * Compress and upload image in Buffer to AWS S3 Storage
 *
 * @param {Buffer} image Buffer of the input image
 * @param {String} path New path of the upload image
 */

const compressAWS = (image, path) => {
    return new Promise((resolve, reject) => {
        sharp(image)
            .jpeg(imageConfig)
            .toBuffer()
            .then(buffer => {
                const params = {
                    Body: buffer,
                    Bucket: config.AWS_S3_BUCKET,
                    Key: path,
                    ACL: 'public-read'
                };

                s3.putObject(params, (err, data) => {
                    if (err) reject(new InternalServerError("Có lỗi xảy ra khi upload ảnh! Vui lòng thử lại hoặc liên hệ Admin để báo lỗi!"));
                    resolve();
                })
            })
            .catch(err => {
                reject(new InternalServerError("Có lỗi xảy ra trong quá trình xử lý ảnh! Vui lòng thử lại hoặc liên hệ Admin để báo lỗi!"));
                resolve();
            });
    })

}


/** 
 * Compress and store image in Buffer to path given in params
 *
 * @param {Buffer} image Buffer of the input image
 * @param {String} path New path of the upload image
 */
const compress = (image, path, option = { width: 1200, height: null }) => {
    // Ensure that the filepath is exists (create a dummy file at the path)
    // Or the program will be crash unexpectedly!
    fs.ensureFileSync(path);

    return new Promise((resolve, reject) => {
        sharp(image)
            .jpeg(imageConfig)
            .resize(option.width, option.height, { withoutEnlargement: true })
            .toFile(path, (err, info) => {
                if (err) {
                    console.log(err);
                    reject(new InternalServerError("Có lỗi xảy ra trong quá trình xử lý ảnh! Vui lòng thử lại hoặc liên hệ Admin để báo lỗi!"));
                }
                resolve();
            })
    })
}

/**
 * Empty directory
 * 
 * @param {string} dir directory to be empty 
 * @param {string} bucket Bucket name
 */
const emptyDirS3 = async (dir, bucket = config.AWS_S3_BUCKET) => {
    const listParam = {
        Bucket: bucket,
        Prefix: dir
    }
    const objList = await (s3.listObjectsV2(listParam).promise());

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    }
    if (objList.Contents.length == 0) return;
    objList.Contents.map(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await (s3.deleteObjects(deleteParams).promise());

    if (objList.IsTruncated) await emptyDirS3(dir, bucket);
}

const deleteObject = async (path, bucket = config.AWS_S3_BUCKET) => {
    const deleteObjectParam = {
        Bucket: bucket,
        Key: path
    }

    s3.deleteObject(deleteObjectParam, (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log(`Deleted ${path}`);
    })

}
/**
 * List images in s3 dir
 * 
 */

const listObject = async (path, bucket = config.AWS_S3_BUCKET) => {
    const listParam = {
        Bucket: bucket,
        Prefix: path
    }
    let result = [];
    const objList = await (s3.listObjectsV2(listParam).promise());
    objList.Contents.map(({ Key }) => {
        result.push(`${AWS_S3_HOST_NAME}/${Key}`);
    });
    return result;
}

const CF_API_PURGE = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`
const CF_MAX_AMOUNT_PER_REQ = 30;
const purgeCloudFlare = AsyncCatch(async (path = [], time = 0) => {
    try {
        const start = time * CF_MAX_AMOUNT_PER_REQ - 1 < 0 ? 0 : time * CF_MAX_AMOUNT_PER_REQ - 1;
        const end = path.length - start <= CF_MAX_AMOUNT_PER_REQ ? path.length - 1 : start + CF_MAX_AMOUNT_PER_REQ - 1;
        console.log(path, start, end);

        const headers = {
            'X-Auth-Email': CLOUDFLARE_EMAIL,
            'X-Auth-Key': CLOUDFLARE_API_KEY,
            'Content-Type': 'application/json'
        }

        const data = {
            files: path.slice(start, end)
        }

        await axios.post(CF_API_PURGE,
            data, {
            headers: headers
        })
            .then(data => {
                console.log("Purge cache CF success!");
            })
            .catch(error => {
                console.error(error.response.data.errors);
                throw new BadRequest("Lỗi server ảnh!");
            })

        if (end < path.length - 1) await purgeCloudFlare(path, time + 1);
    } catch (error) {
        throw error;
    }
})

module.exports = {
    compress,
    compressAWS,
    emptyDirS3,
    deleteObject,
    listObject,
    purgeCloudFlare
}