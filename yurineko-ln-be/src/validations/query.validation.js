const Joi = require("joi")
const { pageSize } = require("../config/config")

const queryWithOnlyPagination = {
    query: Joi.object({
        page: Joi.number().integer().positive().default(1),
        pageSize: Joi.number().integer().positive().default(pageSize)
    })
}

const queryWithFinding = {
    query: Joi.object({
        query: Joi.string().allow("").default(""),
        page: Joi.number().integer().positive().default(1),
        pageSize: Joi.number().integer().positive().default(pageSize)
    })
}

const queryWithOnlyParamId = {
    params: Joi.object({
        id: Joi.number()
            .integer()
            .positive()
            .required()
    })
}

const queryOnlyType = {
    query: Joi.object({
        type: Joi.string().valid('view', 'list', 'like').required()
    })
}

module.exports = {
    queryWithOnlyPagination,
    queryWithFinding,
    queryWithOnlyParamId,
    queryOnlyType
}