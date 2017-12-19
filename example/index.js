/* eslint-disable no-console */
const moduleLoader = require('../');

const main = async function() {
  const modules = await moduleLoader({
    path: `${__dirname}/modules`,
    debug: true
  });
  console.log('GOOD');
  console.log(modules.heros.primary.render({ headline: 'headline', copy: 'copy' }));
  console.log('');
  console.log('MISSING');
  console.log(modules.heros.primary.render({ headline: 'headline' }));
  console.log('');
  console.log('EXTRA');
  console.log(modules.heros.primary.render({ headline: 'headline', copy: 'copy', extra: 1 }));
  console.log('');
  console.log('SECONDARY');
  console.log(modules.heros.secondary.render({ content: { headline: 'headline', copy: 'copy' }, user: { name: 'bob', id: '123' } }));
  console.log('');
  console.log('SECONDARY MULTIPLE ARGS');
  console.log(modules.heros.secondary.render({ content: { headline: 'headline', copy: 'copy' } }, { user: { name: 'bob', id: '123' } }));
  console.log('');
  console.log('EXAMPLE');
  console.log(modules.heros.primary.getExamples());
  console.log('EXAMPLE 2');
  console.log(modules.heros.secondary.getExamples());
};
main();
