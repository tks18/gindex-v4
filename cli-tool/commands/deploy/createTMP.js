const tmp = require('tmp');
const path = require('path');

module.exports = (exFunc) => {
  try {
    return tmp.dir({ template: 'gindex-cli-XXXXXX' },async function _tempDirCreated(err, tmppath, cleanupCallback) {
      if (err) throw err;
      const resPath = await path.join(tmppath, 'backend');
      await exFunc(tmppath, resPath);
    });
  } catch(e) {
    console.log(e);
  }
};
