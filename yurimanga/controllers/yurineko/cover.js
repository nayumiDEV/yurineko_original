const { AsyncCatch } = require("../../helpers/utilities");
const {AWS_S3_HOST_NAME} = require('../../configs/env');
const { NotFound } = require("../../helpers/response");
const getCover = AsyncCatch(async (req, res, next) => {
    switch (req.params.place) {
        case 'homepage':
            res.send(`${AWS_S3_HOST_NAME}/cover/homepage.jpeg`);
            break;
        case 'mangainfo':
            res.send(`${AWS_S3_HOST_NAME}/cover/mangainfo.jpeg`); 
            break;
        case 'r18':
            res.send(`${AWS_S3_HOST_NAME}/cover/r18.jpeg`); 
            break;
        default:
            throw new NotFound('Không tìm thấy cover!');
    }
})

module.exports = getCover;