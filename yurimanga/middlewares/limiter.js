const rateLimit = require('express-rate-limit');

module.exports = (max = 5, penalty = 15) => rateLimit({
    windowMs: penalty * 1000,
    max: max,
    message: "Bạn thao tác quá nhanh! Vui lòng thử lại sau!"
})