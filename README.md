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
```

## Modules

A _module_ consists of 3 parts:

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

---

<a href="https://firstandthird.com"><img src="https://firstandthird.com/_static/ui/images/safari-pinned-tab-62813db097.svg" height="32" width="32" align="right"></a>

_A [First + Third](https://firstandthird.com) Project_
