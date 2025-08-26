const Joi = require("joi");

const createChapter = {
    body: Joi.object({
        name: Joi.string(),
        content: Joi.object(),
        lightnovelId: Joi.number()
            .integer()
            .positive()
            .required(),
        publish: Joi
            .number()
            .integer()
            .valid(0, 1)
            .default(0)
    })
}

const editChapter = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
    }),
    body: Joi.object({
        name: Joi.string(),
        content: Joi.object(),
        publish: Joi
            .number()
            .integer()
            .valid(0, 1)
            .default(0)
    })
}

const changeSequence = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
    }),
    body: Joi.object({
        sequence: Joi.number()
            .integer()
            .positive()
            .required()
    })
}


module.exports = {
    create: createChapter,
    edit: editChapter,
    changeSequence
}