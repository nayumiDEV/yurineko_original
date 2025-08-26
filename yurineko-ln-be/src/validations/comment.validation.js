const Joi = require("joi");
const config = require("../config/config");

const createChapter = {
    body: Joi.object({
        lightnovelID: Joi.number().integer().positive().required(),
        chapterID: Joi.number().integer().default(0),
        content: Joi.string().allow(null, "").default(""),
        replyID: Joi.number().integer().default(0)
    })
}

const deleteChapter = {
    params: Joi.object({
        id: Joi.number().integer().positive().required()
    })
}

const getComment = {
    query: Joi.object({
        lightnovelID: Joi.number().integer().positive().required(),
        chapterID: Joi.number().integer().default(0),
        page: Joi.number().integer().positive().default(1),
        pageSize: Joi.number().integer().positive().default(config.pageSize)
    })
}

module.exports = {
    create: createChapter,
    delete: deleteChapter,
    get: getComment
}