const { AsyncCatch, uploadErrHandler, handleFilePath } = require("../../helpers/utilities");
const multer = require('multer');
const path = require('path')
const { compress, purgeCloudFlare } = require('../../helpers/process');
const fs = require('fs-extra');
const { BadRequest, NotFound } = require("../../helpers/response");
const upload = require("../../helpers/upload");
const { STORAGE_DIR, AWS_S3_HOST_NAME } = require("../../configs/env");

const uploadControl = upload.fields([{ name: 'homepage', maxCount: 1 }, { name: 'r18', maxCount: 1 }, { name: 'manga', maxCount: 1 }]);

/*                  PATH                    */
const logicPath = './public/images/covers/';

const imageSetting = AsyncCatch(async (req, res, next) => {
    uploadControl(req, res, (err) => {
        uploadErrHandler(err)
            .then(async () => {
                let filePath;
                let url = [];
                if (req.files.homepage && req.files.homepage[0]) {
                    filePath = 'cover/homepage.jpeg';
                    url.push(`${AWS_S3_HOST_NAME}/${filePath}`);
                    compress(req.files.homepage[0].buffer, `${STORAGE_DIR}/${filePath}`)
                        .catch(err => next(err));
                }

                if (req.files.r18 && req.files.r18[0]) {
                    filePath = 'cover/r18.jpeg';
                    url.push(`${AWS_S3_HOST_NAME}/${filePath}`);
                    compress(req.files.r18[0].buffer, `${STORAGE_DIR}/${filePath}`)
                        .catch(err => next(err));
                }

                if (req.files.manga && req.files.manga[0]) {
                    filePath = 'cover/mangainfo.jpeg';
                    url.push(`${AWS_S3_HOST_NAME}/${filePath}`);
                    compress(req.files.manga[0].buffer, `${STORAGE_DIR}/${filePath}`)
                        .catch(err => next(err));
                }
                await purgeCloudFlare(url);
                res.send("Success!");
            })
            .catch(err => next(err));
    });
});

module.exports = {
    setCover: imageSetting
};