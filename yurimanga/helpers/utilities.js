const _ = require("lodash");
const Joi = require("joi");
const { DefaultError, STATUS_CODE, BadRequest, InternalServerError } = require("./response");
const { PAGE_SIZE, AWS_S3_HOST_NAME } = require("../configs/env");
const db = require('../db');
const multer = require('multer');
const path = require('path');

const pagination = (page, pagesize = PAGE_SIZE) => ((page ? page : 1) - 1) * pagesize;

const AsyncCatch = (fn) => {
    return (req, res, next) => fn(req, res, next).catch(next);
}

const listImageChapter = (mangaId, chapterId, maxId) => {
    let result = [];
    for (let i = 1; i <= maxId; ++i)
        result.push(`${AWS_S3_HOST_NAME}/manga/${mangaId}/chapters/${chapterId}/${i}.jpeg`);
    return result;
}

const handleError = (err, req, res, next) => {
    if (err instanceof DefaultError) {
        return res.status(err.getCode()).json({
            message: err.message
        })
    };
    console.error(err);
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: 'Something wrong! Try again!'
    })
}

const uploadErrHandler = (err) => {
    return new Promise((resolve, reject) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_UNEXPECTED_FILE")
                    return reject(new BadRequest("Số file upload vượt quá quy định!"));
                if (err.code === "LIMIT_FILE_SIZE")
                    return reject(new BadRequest("File upload quá lớn!"));
                return reject(new BadRequest("Lỗi file! Vui lòng thử lại hoặc báo cho kỹ thuật!"));
            }
            return reject(err);
        }
        resolve();
    })
}

const validator = (fields, values) => {
    const input = [];
    for (let item in fields) input.push(item);
    const info = _.pick(values, input);
    const { error, value } = Joi.object(fields).validate(info);
    if (error) throw new BadRequest(error.message);
    return value;
}

const checkID = (id) => /^\d+$/.test(id);

const deleteQueryHelper = type => {
    return {
        check: `SELECT id FROM ${type} WHERE id = ?`,
        DEL: [
            `DELETE FROM ${type} WHERE id = ?`,
            `DELETE FROM manga_${type} WHERE ${type}ID = ?`
        ]
    }
}

const handleFilePath = (logicPath, name) => `${path.resolve(logicPath)}\\${name}`;


const mangaUrl = (mangaID, chapterID = 0) => {
    if (chapterID != 0) return `/read/${mangaID}/${chapterID}`;
    else return `/manga/${mangaID}`;
}

const isR18 = async (mangaId) => {
    const check = await db.queryPlaceholdersAsync("SELECT EXISTS(SELECT 1 FROM manga_tag WHERE mangaID = ? AND tagID = 1) AS isR18", [mangaId]);
    return check[0].isR18;
}

/**
 * Sanitize html tags in string
 * @param {String} string 
 * @returns Sanitized html tags string
 */
const sanitizeHtml = (string) => {
    return string.replace(/<[^>]*>?/gm, '');
}

const storageImage = (context) => `${AWS_S3_HOST_NAME}/${context}`;

module.exports = {
    isR18,
    pagination,
    AsyncCatch,
    handleError,
    validator,
    deleteQueryHelper,
    uploadErrHandler,
    handleFilePath,
    mangaUrl,
    listImageChapter,
    checkID,
    sanitizeHtml,
    storageImage
}