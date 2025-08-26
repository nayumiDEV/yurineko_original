const { default: fetch, Body } = require("node-fetch");
const { Unauthorized } = require("../helpers/response");
const { AsyncCatch } = require("../helpers/utilities");

const captcha = AsyncCatch(async (req, res, next) => {
  next();
  /*try {
    if (
      req.headers["g-recaptcha-response"] === undefined ||
      req.headers["g-recaptcha-response"] === "" ||
      req.headers["g-recaptcha-response"] === null
    )
      throw new Unauthorized("Bạn cần xác nhận captcha!");
    const secretKey = "6LfFsuYUAAAAAOnL4HWM6e1X6Y3hmF-aLIjgE5Ex";
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.headers["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;

    await fetch(verificationUrl)
      .then(google_response => {
        if (google_response.success && google_response.success == true) next();
        else throw new Unauthorized("Lỗi captcha, vui lòng thử lại!");
      })
      .catch(error => {
        console.log(error);
        throw error;
      })
  } catch (error) {
    throw error;
  }*/
});

module.exports = captcha;
