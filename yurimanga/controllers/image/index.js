const { STORAGE_DIR } = require("../../configs/env");
const { AsyncCatch } = require("../../helpers/utilities");
const { compress } = require('../../helpers/process');
const { queryPlaceholdersAsync } = require("../../db");
const nanoid = require('nanoid');

const temporaryImageUpload = AsyncCatch(async (req, res, next) => {
    const path = `storage/${Date.now()}-${nanoid()}.jpeg`;
    const realPath = `${STORAGE_DIR}/${path}`;

    await compress(req.file.buffer, realPath);

    const insertTempOperation = await queryPlaceholdersAsync(
        "INSERT INTO temp(path, createAt) VALUES (?, DATE_ADD(CURRENT_TIMESTAMP(), INTERVAL 12 HOUR))",
        [path]
    )

    res.send({ id: insertTempOperation.insertId, path: path });
})

module.exports = temporaryImageUpload;