const { AsyncCatch, validator } = require("../../helpers/utilities");
const userValidator = require("../../validators/user.validator");
const db = require('../../db');
const { BadRequest, NotFound } = require("../../helpers/response");
const isInteger = require("lodash.isinteger");
const paymentValidator = require("../../validators/payment.validator");
const { default: axios } = require("axios");
const { BAOKIM_API_KEY, BAOKIM_API_SECRET, BAOKIM_API_ENDPOINT, HOST, BAOKIM_TOKEN_EXPIRE, API_HOST, BAOKIM_MERCHANT_ID } = require("../../configs/env");
const jwt = require('jsonwebtoken');

const premiumReg = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    const { planID } = req.body;

    if (!isInteger(parseInt(planID))) throw new BadRequest("Gói không hợp lệ!");

    const premium = await db.queryPlaceholdersAsync("SELECT price, month FROM premium_price WHERE id = ?", [planID]);
    if (premium.length == 0) throw new BadRequest("Gói không hợp lệ!");

    const uMoney = await db.queryPlaceholdersAsync("SELECT (money >= ?) AS enoughMoney, premiumTime FROM user WHERE id = ?", [premium[0].price, uid]);

    if (uMoney[0].enoughMoney == false) throw new BadRequest("Tiền trong tài khoản không đủ!");


    let currentDate = new Date();
    currentDate = currentDate > uMoney[0].premiumTime ? currentDate : uMoney[0].premiumTime;
    const newDate = new Date(currentDate.setTime(currentDate.getTime() + premium[0].month * 30 * 86400000));
    await db.queryPlaceholdersAsync("UPDATE user SET money = money - ?, premiumTime = ? WHERE id = ?", [premium[0].price, newDate, uid]);
    res.send("Success!");
})

const PAYMENT_STATUS = Object.freeze({
    IN_PROGRESS: 0,
    OK: 1,
})

const time = () => Math.floor(new Date().getTime() / 1000);

const placeOrder = AsyncCatch(async (req, res, next) => {
    const uid = req.userData.id;
    const u_email = req.userData.email;
    const { money } = validator(paymentValidator(['money']), req.body);
    const placeOrder = await db.queryPlaceholdersAsync("INSERT INTO payment (userID, money, status, method) VALUES(?, ?, ?, ?)", [uid, money, PAYMENT_STATUS.IN_PROGRESS, 'Bảo Kim']);
    const issueAt = time();

    const data = {
        mrc_order_id: placeOrder.insertId,
        total_amount: money,
        description: `${u_email} nạp ${money} qua Bảo Kim`,
        url_success: `${HOST}`,
        url_cancel: `${HOST}`,
        webhooks: `${API_HOST}/addFunds/${placeOrder.insertId}`,
        accept_qrpay: 1,
        customer_email: u_email,
        merchant_id: BAOKIM_MERCHANT_ID
    };

    const payload = {
        iat: issueAt,
        iss: BAOKIM_API_KEY,
        nbf: issueAt,
        exp: issueAt + BAOKIM_TOKEN_EXPIRE,
        form_params: data
    };

    const token = jwt.sign(payload, BAOKIM_API_SECRET);

    axios.post(`${BAOKIM_API_ENDPOINT}/api/v4/order/send`, data, {
        headers: {
            jwt: `Bearer ${token}`
        }
    })
        .then(data => {
            if (data.data.code == 0)
                res.send(data.data.data.payment_url);
            else throw new BadRequest(data.data.message[0]);
        }).catch(error => next(error));
})

const addFunds = AsyncCatch(async (req, res, next) => {
    const { id } = req.params;

    const checkOrder = await db.queryPlaceholdersAsync("SELECT userID, money FROM payment WHERE id = ? AND status = ? LIMIT 1", [id, PAYMENT_STATUS.IN_PROGRESS]);
    if (checkOrder.length == 0) throw new NotFound("Đơn hàng không tồn tại hoặc đã kết thúc!");

    const uid = checkOrder[0].userID;
    const issueAt = time();

    const payload = {
        iat: issueAt,
        iss: BAOKIM_API_KEY,
        nbf: issueAt,
        exp: issueAt + BAOKIM_TOKEN_EXPIRE
    };

    const token = jwt.sign(payload, BAOKIM_API_SECRET);

    axios.get(`${BAOKIM_API_ENDPOINT}/api/v4/order/detail?mrc_order_id=${id}`, {
        headers: {
            jwt: `Bearer ${token}`
        }
    })
        .then(data => {
            if (data && data.data && data.data.code == 0) {
                if (data.data.data.stat == 'c') {
                    // cộng tiền theo lượng tiền đã thanh toán chứ không cộng theo order!
                    db.queryPlaceholdersAsync("UPDATE user SET money = money + ? WHERE id = ?", [data.data.data.total_amount, uid]);
                    db.queryPlaceholdersAsync("UPDATE payment SET status = ? WHERE id = ?", [PAYMENT_STATUS.OK, id]);
                    res.send({ "err_code": "0", "message": "Success!" });
                }
                else throw new BadRequest("Đơn hàng chưa được thanh toán!");
            }
            else throw new BadRequest(data.data.message[0]);
        })
        .catch(err => next(err))
})

module.exports = {
    reg: premiumReg,
    placeOrder,
    addFunds
}