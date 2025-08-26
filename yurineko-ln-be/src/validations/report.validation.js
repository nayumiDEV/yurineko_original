const Joi = require("joi");

const createReport = {
    body: Joi.object({
        lightnovelId: Joi.number().integer().positive().required(),
        chapterId: Joi.number().integer().required(),
        type: Joi.number().integer().less(7).required(),
        detail: Joi.string().allow("", null).default(null)
    })
}

module.exports = {
    create: createReport
}