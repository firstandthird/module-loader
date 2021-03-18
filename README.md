<h1 align="center">module-loader</h1>

<p align="center">
  <img src="https://img.shields.io/npm/v/@firstandthird/module-loader.svg?label=npm&style=for-the-badge" alt="NPM" />
</p>

Helper that automatically loads [nunjucks](https://mozilla.github.io/nunjucks/) modules (view, schema and example.js for using the template.

## Installation

```sh
npm install @firstandthird/module-loader
```

_or_

```sh
yarn add @firstandthird/module-loader
```

## Usage:

```js
const moduleLoader = require('@firstandthird/module-loader');

const modules = await moduleLoader({
  path: `/modules`
});

const theModule = modules['my_module'];

const output = theModule.render({ val1: 'hello', val2: 'world' });
```

Each module in the returned set of modules will contain the following methods and properties:

- _renderRaw()_

  A function that takes in the context to apply to the view, attempts to validate the context and then returns the rendered string, eg:

  _theModule.renderRaw({ val1: 'hello', val2: 'world' });_

  _renderRaw()_ will log an error message if the validation check fails, but it has no error handling.  If there is an error rendering the view then it will throw the error and you will need to handle it yourself in code.

- _render()_

  is a wrapper for the _renderRaw_ method that will attempt to safely render and handle any errors for you:

  _theModule.render({ val1: 'hello', val2: 'world' });_

- _getExamples()_

  This will render and return an example of the template, along with the example data used to render it and any config data supplied to the module.

- _fullPath_

  The full path to the module

- _name_

  The name of the module

- _exampleData_

  This will return an array containing the config and any example data used by the _getExamples()_ function.


## Module Format

A _module_ is a sub-directory consisting of 3 parts:

- __view.njk__

  A nunjucks .njk file containing the template to be rendered:

  ```html
  <div>
    This is an example
    <h1>{{ val1 }}</h1>
    <p>{{ val2 }}</p>
  </div>
  ```

- __schema.js__

  A [Joi](https://www.npmjs.com/package/@hapi/joi) schema validator, this will be applied to the context before the view is rendered:

  ```js
  const Joi = require('joi');
  module.exports = {
    val1: Joi.string().max(100),
    val2: Joi.string()
  };
  ```

_ __example.js__

  A sample context and config in the form:
  ```js
  module.exports = [
    {
      _config: {
        wrapStart: '<div class="container">',
        wrapEnd: '</div>',
        name: 'main'
      },
      val1 'example 1',
      val2 'example 2'
    },
    {
      val1 'example 1',
      val2 'example 2'
    }
  ];
  ```


## Additional Options

- __path__ (required)

  The path to search for modules

- __env__

  A nunjucks [compile environment](https://mozilla.github.io/nunjucks/api.html#compile) that will be passed to the nunjucks _compile()_ method.

- __debug__

  When `true` this prints additional information when loading modules, default is false.

- __log__

  A function that module-loader will use to print logging and debug information.  Default is _console.log()_.

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
