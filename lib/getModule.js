const fs = require('fs');
const util = require('util');
const path = require('path');
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const Joi = require('joi');
const nunjucks = require('nunjucks');
const aug = require('aug');

module.exports = async function({ fullPath, name }, { env, log, debug }) {
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
    if (!Array.isArray(exampleData)) {
      exampleData = [exampleData];
    }
  } catch (e) {
    exampleData = [];
  }

  const validate = function(data) {
    if (!schema) {
      return { value: data };
    }
    if (Joi.isSchema(schema)) {
      return schema.validate(data, { presence: 'required' });
    }
    return Joi.object(schema).validate(data, { presence: 'required' });
  };
  const html = await readFile(path.join(fullPath, 'view.njk'), 'utf8');
  const compiled = nunjucks.compile(html, env);

  const safe = function (str) {
    return new nunjucks.runtime.SafeString(str);
  };

  const renderRaw = function(...args) {
    const data = args.length === 1 ? args[0] : aug(...args);
    const result = validate(data);
    if (result.error) {
      log({
        message: `${name} has incorrect data`,
        error: {
          name: result.error.name,
          details: result.error.details
        },
        fullPath,
        name,
        data
      });
      if (debug) {
        return `<pre class="error">${JSON.stringify(result.error, null, 2)}</pre>`;
      }
    }
    return compiled.render(result.value);
  };

  const render = function (...args) {
    let output = '';

    try {
      output = safe(renderRaw(...args));
    } catch (e) {
      log({
        message: `Error in module ${name}`,
        error: e,
        fullPath,
        name,
        ...args
      });
    }

    return output;
  };

  const getExamples = function() {
    return exampleData.map(exampleClean => {
      const example = aug(exampleClean);
      const config = example._config || {}; //eslint-disable-line no-underscore-dangle
      delete example._config; //eslint-disable-line no-underscore-dangle
      const out = renderRaw(example);
      return {
        config,
        html: out,
        exampleData: example
      };
    });
  };

  return {
    render,
    renderRaw,
    getExamples,
    exampleData,
    fullPath,
    name
  };
};
