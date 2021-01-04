const Joi = require('joi');
const getCategories = require('./lib/getCategories');
const getModules = require('./lib/getModules');
const getModule = require('./lib/getModule');

module.exports = async function(opts) {
  const schema = {
    path: Joi.string(),
    env: Joi.any(),
    debug: Joi.boolean().default(false),
    log: Joi.func().default(console.log) //eslint-disable-line no-console
  };
  const result = Joi.object(schema).validate(opts);
  if (result.error) {
    throw result.error;
  }
  const options = result.value;

  const categories = await getCategories(options.path);

  const modules = {};
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    modules[cat.name] = {};

    const catModules = await getModules(cat);

    for (let x = 0; x < catModules.length; x++) {
      const module = catModules[x];

      modules[cat.name][module.name] = await getModule(module, {
        env: options.env,
        log: options.log,
        debug: options.debug
      });
    }
  }

  return modules;
};
