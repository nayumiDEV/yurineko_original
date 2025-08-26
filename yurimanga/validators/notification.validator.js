const Joi = require("joi");

module.exports = function (fields = []) {
  const getSchema = (field) => {
    switch (field) {
      case "type":
        return Joi.string()
          .valid("test", "manga_publish", "ln_publish", "manga_new_chapter", "ln_new_chapter", "manga_comment_reply", "ln_comment_reply", "manga_comment_reply_following", "ln_comment_reply_following", "manga_comment_like", "ln_comment_like", "manga_comment_team", "ln_comment_team")
          .required()
      case "title":
        return Joi.string()
          .required()
      case "body":
        return Joi.string()
          .required()
      case "objectId":
        return Joi.number()
          .integer()
          .required()
      case "senderId":
        return Joi.number()
          .integer()
          .default(0)
      case "thumbnail":
        return Joi.string()
          .required()
      case "url":
        return Joi.string()
          .uri()
          .required()
      case "icon":
        return Joi.string()
          .allow("", null)
          .default("")
      case "push":
        return Joi.boolean()
          .default(true)
    }
  };

  const schema = {};

  for (let item of fields) {
    schema[`${item}`] = getSchema(item);
  }

  return schema;
};