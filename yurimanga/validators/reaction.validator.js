const Joi = require("joi");

const reaction = {
  body: Joi.object({
    id: Joi.number().integer().positive().required(),
    type: Joi.string().valid("like", "love", "haha", "wow", "sad", "what", "angry").default("like")
  })
}

const unReaction = {
  body: Joi.object({
    id: Joi.number().integer().positive().required()
  })
}

const listUserReaction = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  query: Joi.object({
    type: Joi.string().valid("all", "like", "love", "haha", "wow", "sad", "what", "angry").default("all"),
    page: Joi.number().integer().positive().default(1),
    pageSize: Joi.number().integer().positive().default(20)
  })
}

module.exports = {
  reaction,
  unReaction,
  listUserReaction
}