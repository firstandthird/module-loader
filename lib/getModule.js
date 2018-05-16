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
    return Joi.validate(data, schema, { presence: 'required' });
  };
  const html = await readFile(path.join(fullPath, 'view.njk'), 'utf8');
  const compiled = nunjucks.compile(html, env);

  const safe = function(str) {
    return new nunjucks.runtime.SafeString(str);
  };

  const renderRaw = function(...args) {
    const data = args.length === 1 ? args[0] : aug(...args);
    const result = validate(data);
    if (result.error) {
      log({
        message: `${name} has incorrect data`,
        error: result.error,
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

  const render = function(...args) {
    return safe(renderRaw(...args));
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

  const capitalizeFirstLetter = function(string) {
    return string[0].toUpperCase() + string.slice(1);
  };

  const describe = function(sc) {
    const res = Joi.describe(sc || schema);
    let result = '';
    console.log(JSON.stringify(res));

    function print(data) {
      result += '<ul>';

      if (data.type !== 'alternatives') {
        result += `<li><strong>Type:</strong> ${capitalizeFirstLetter(data.type)}`;
      } else {
        result += '<li><strong>One of the following:</strong>';
        data.alternatives.forEach(alternative => print(alternative));
      }

      result += '<ul>';

      if (data.rules) {
        result += '<li><strong>Rules:</strong></li><ul>';
        data.rules.forEach(rule => {
          result += `<li>${rule.name}: ${rule.arg}</li>`;
        });
        result += '</ul>';
      }

      if (data.flags) {
        result += '<li><strong>Flags:</strong></li><ul>';
        Object.keys(data.flags).forEach(flag => {
          result += `<li>${capitalizeFirstLetter(flag)}: ${data.flags[flag]}</li>`;
        });
        result += '</ul>';
      }

      if (data.valids) {
        result += `<li><strong>Valids:</strong> ${data.valids
          .map(item => `"${item}"`)
          .join(', ')}</li>`;
      }

      if (data.invalids) {
        result += `<li><strong>Invalids:</strong> ${data.invalids
          .map(item => `"${item}"`)
          .join(', ')}</li>`;
      }

      if (data.children) {
        Object.keys(data.children).forEach(child => {
          result += `<li><strong>${child}</strong>`;
          print(data.children[child]);
          result += '</li>';
        });
      }

      result += '</ul></li></ul>';
    }
    
    print(res);

    return result;
  };

  return {
    render,
    renderRaw,
    getExamples,
    describe,
    exampleData,
    fullPath,
    name
  };
};
