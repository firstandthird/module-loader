const Joi = require('joi');
module.exports = {
  content: Joi.object().keys({
    headline: Joi.string().max(100),
    copy: Joi.string()
  }),
  user: Joi.object().keys({
    name: Joi.string()
  }).unknown()
};
