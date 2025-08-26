const Joi = require("joi");

module.exports = Joi.object({
    params: Joi.object({
        id: Joi.string().invalid('1'),
    }),
    query: Joi.object({

        type: Joi.string().valid('view', 'list', 'like')
    })
})