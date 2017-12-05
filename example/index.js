const moduleLoader = require('../');

const main = async function() {
  const modules = await moduleLoader({
    path: `${__dirname}/modules`
  });
  console.log('GOOD');
  console.log(modules.heros.primary({ headline: 'headline', copy: 'copy' }));
  console.log('MISSING');
  console.log(modules.heros.primary({ headline: 'headline' }));
  console.log('EXTRA');
  console.log(modules.heros.primary({ headline: 'headline', copy: 'copy', extra: 1 }));
}
main();
