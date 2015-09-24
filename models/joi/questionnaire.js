var Joi = require('joi');

var QuestionnaireUpdate = {
  description : Joi.string(),
  explanation : Joi.string().required(),
  questions   : Joi.array().items(Joi.object().keys({
    tech   : Joi.boolean().required(),
    text   : Joi.string().required(),
    values : Joi.array().items(Joi.object().keys({
      value  : Joi.string().required(),
      weight : Joi.number().required()
    }))
  }))
};

module.exports = {
  get : {
    query : {
      version : Joi.alternatives().try(Joi.number(), Joi.string().allow('all'))
    },
    options : {
      allowUnknownQuery: false,
      allowUnknownParams: false
    }
  },
  postAndPut : {
    options : {
      allowUnknownBody: false,
      allowUnknownQuery: false,
      allowUnknownParams: false
    },
    body : QuestionnaireUpdate
  }
};
