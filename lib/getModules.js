const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);
module.exports = async function({ fullPath, name }) {
  const moduleNames = await readdir(fullPath);
  return moduleNames.map(f => ({
    fullPath: `${fullPath}/${f}`,
    name: f
  }));
};
