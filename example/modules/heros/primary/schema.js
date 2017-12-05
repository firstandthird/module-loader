const Joi = require('joi');
module.exports = {
  headline: Joi.string().max(100),
  copy: Joi.string()
};
