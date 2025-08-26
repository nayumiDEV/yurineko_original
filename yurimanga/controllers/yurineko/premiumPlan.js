const { AsyncCatch } = require("../../helpers/utilities");
const db = require('../../db');
const { AWS_S3_HOST_NAME } = require("../../configs/env");

module.exports = AsyncCatch(async (req, res, next) => {
    const result = await db.queryPlaceholdersAsync("SELECT * FROM premium_price");
    result.forEach(e => {
        e.thumbnail = `${AWS_S3_HOST_NAME}/${e.thumbnail}`;
    });
    
    res.send({
        banner: `${AWS_S3_HOST_NAME}/images/premium/banner.jpeg`,
        result
    });
})

