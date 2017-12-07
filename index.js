const Joi = require('joi');
const getCategories = require('./lib/getCategories');
const getModules = require('./lib/getModules');
const getModule = require('./lib/getModule');

module.exports = async function(opts) {
  const schema = {
    path: Joi.string()
  };
  const result = Joi.validate(opts, schema);
  if (result.error) {
    throw result.error;
  }
  const options = result.value;

  const categories = await getCategories(options.path);

  const modules = {};
  for (let i = 0; i < categories.length; i++) {
    let cat = categories[i];
    modules[cat.name] = {};

    let catModules = await getModules(cat);

    for (let x = 0; x < catModules.length; x++) {
      let module = catModules[x];

      modules[cat.name][module.name] = await getModule(module, options.compile);
    }
  }

  return modules;
}
