const Joi = require('joi');

module.exports = {
  title: Joi.ref('content.headline'),
  content: Joi.object().keys({
    headline: Joi.string().allow(''),
    copy: Joi.string(),
    number: Joi.number().max(100).valid([10, 12, 13])
  }),
  user: Joi.alternatives([
    Joi.object().keys({
      name: Joi.string().default('Username').min(2)
    }).unknown(),
    Joi.string().required()
  ])
};