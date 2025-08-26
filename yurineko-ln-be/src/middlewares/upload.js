const multer = require('multer');
const { BadReqest } = require('../utils/response');
const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    )
        cb(null, true);
    else {
        cb(new BadReqest("Lỗi định dạng file! Chỉ chấp nhận file ảnh!"), false);
    }
};

module.exports = multer({
    storage: multerStorage,
    limits: { fileSize: 7 * 1024 * 1024 }, // 7MB / file
    fileFilter: fileFilter
})