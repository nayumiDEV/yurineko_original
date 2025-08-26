const multer = require('multer');
const { BadRequest } = require('./response');
const multerStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "doc") { // if uploading docs
    if (
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      cb(null, true);
    else
      cb(new BadRequest("Lỗi định dạng file!"), false);

  } else { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    )
      cb(null, true);
    else {
      cb(new BadRequest("Lỗi định dạng file! Chỉ chấp nhận file ảnh!"), false);
    }
  }
};

module.exports = multer({
  storage: multerStorage,
  limits: { fileSize: 7 * 1024 * 1024 }, // 7MB / file
  fileFilter: fileFilter
})