const fs = require('fs');
const util = require('util');
const path = require('path');
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const Joi = require('joi');

module.exports = async function({ fullPath, name }, compile) {
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
  const compiled = compile(html);


  const render = function(data) {
    const result = validate(data);
    if (result.error) {
      //throw result.error;
      return `<pre class="error">${JSON.stringify(result.error, null, 2)}</pre>`;
    }
    return compiled.render(result.value);
  };

  const example = function() {
    return render(exampleData);
  };

  return {
    render,
    example,
    fullPath,
    name
  };
};
