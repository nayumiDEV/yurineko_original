const Joi = require("joi");

const queryWithOnlyParamsId = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
}

module.exports = {
  queryWithOnlyParamsId
}