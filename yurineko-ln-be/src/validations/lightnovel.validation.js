const Joi = require("joi");
const config = require("../config/config");

const createLightnovel = {
  body: Joi.object({
    originalName: Joi.string(),
    otherName: Joi.string().default(""),
    description: Joi.string().default(""),
    type: Joi.number()
      .integer()
      .min(1)
      .max(2)
      .required(),
    thumbnail: Joi.string()
      .required(),
    tag: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default([]),
    couple: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default([]),
    origin: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default([]),
    author: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default([]),
  })
}

const editLightnovel = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .positive()
      .required()
  }),
  body: Joi.object({
    originalName: Joi.string().default(null),
    otherName: Joi.string().allow("").default(null),
    description: Joi.string().allow("").default(null),
    type: Joi.number()
      .integer()
      .min(1)
      .max(2)
      .default(null),
    thumbnail: Joi.string().default(null),
    tag: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default(null),
    couple: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default(null),
    origin: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default(null),
    author: Joi.array()
      .unique()
      .items(
        Joi.number()
        .integer()
        .positive()
      )
      .default(null),
  })
}

const deleteLightnovel = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
}

const getInfoLightnovel = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
}

const listChapterLightnovel = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  })
}

const searchByType = {
  query: Joi.object({
    type: Joi.string().valid('author', 'tag', 'couple', 'origin', 'team').required(),
    query: Joi.string(),
    page: Joi.number().integer().positive().default(1),
    pageSize: Joi.number().integer().positive().default(config.pageSize),
  })
}

const addTolist = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  body: Joi.object({
    listKey: Joi.string().valid('stop', 'follow', 'done', 'will').required()
  })
}

const getList = {
  query: Joi.object({
    type: Joi.string().valid('stop', 'follow', 'done', 'will', 'all').required(),
    page: Joi.number().integer().positive().default(1),
    pageSize: Joi.number().integer().positive().default(config.pageSize),
  })
}

const changeStatus = {
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  body: Joi.object({
    status: Joi.number().integer().positive().less(8).required()
  })
}

const advancedSearch = {
  query: Joi.object({
    genre: Joi.string().allow("").default(""),
    notGenre: Joi.string().allow("").default(""),
    minChapter: Joi.number().integer().default(1),
    status: Joi.number().integer().default(0),
    sort: Joi.number().integer().positive().max(7),
    page: Joi.number().integer().positive().default(1),
    pageSize: Joi.number().integer().positive().default(config.pageSize),
  })
}

const teamRanking = {
  params: Joi.object({
    id: Joi.string().invalid('1').required()
  }),
  query: Joi.object({
    type: Joi.string().valid('view', 'list', 'like').required()
  })
}

module.exports = {
  create: createLightnovel,
  edit: editLightnovel,
  delete: deleteLightnovel,
  getInfo: getInfoLightnovel,
  listChapterLightnovel,
  searchByType,
  addTolist,
  getList,
  changeStatus,
  advancedSearch,
  teamRanking
}
