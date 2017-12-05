const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
module.exports = async function(path) {
  const files = await readdir(path);

  //TODO: check if directory
  return files.map(f => ({ fullPath: `${path}/${f}`, name: f }));
};
