const fs = require('fs');
const util = require('util');
const path = require('path');
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const Joi = require('joi');
const nunjucks = require('nunjucks');
const aug = require('aug');

module.exports = async function({ fullPath, name }, { env, log }) {
  let schema = null;
  try {
    const schemaPath = path.join(fullPath, 'schema.js');
    await stat(schemaPath);
    schema = require(schemaPath);
  } catch (e) {
    throw e;
  }

  let exampleData = null;
  try {
    exampleData = require(path.join(fullPath, 'example.js'));
  } catch (e) {
    exampleData = {};
  }

  const validate = function(data) {
    if (!schema) {
      return { value: data };
    }
    return Joi.validate(data, schema, { presence: 'required' });
  };
  const html = await readFile(path.join(fullPath, 'view.njk'), 'utf8');
  const compiled = nunjucks.compile(html, env);

  const safe = function(str) {
    return new nunjucks.runtime.SafeString(str);
  };

  const render = function(...args) {
    const data = args.length === 1 ? args[0] : aug(...args);
    const result = validate(data);
    if (result.error) {
      //throw result.error;
      if (process.env.NODE_ENV === 'production') {
        log({
          message: `${name} has incorrect data`,
          error: result.error,
          fullPath,
          name,
          data
        });
      } else {
        return safe(`<pre class="error">${JSON.stringify(result.error, null, 2)}</pre>`);
      }
    }
    return safe(compiled.render(result.value));
  };

  const example = function() {
    return render(exampleData);
  };

  return {
    render,
    example,
    exampleData,
    fullPath,
    name
  };
};
