const unzipper = require('unzipper');
const fs = require('fs');
const tmp = require('tmp');
const axios = require('axios');
const release = require('./getReleases');

module.exports = async () => {
  try {
    tmp.dir({ template: 'gindex-cli-XXXXXX' },async function _tempDirCreated(err, path, cleanupCallback) {
      if (err) throw err;
      console.log('Dir: ', path);
      // const resp = await execa('git', ['clone', '--branch', response.username, 'https://github.com/tks18/tks18.git', '__temp__']);
      // console.log(resp);
      let latVerUrl = await release();
      await axios({
          method: "get",
          url: `https://github.com/tks18/gindex-v4/releases/download/${latVerUrl.tag_name}/${latVerUrl.assets[0].name}`,
          responseType: "stream"
      }).then(resp => {
        resp.data.pipe(fs.createWriteStream(path+"/latest.zip").on('finish', () => {
          fs.createReadStream(path+"/latest.zip").pipe(unzipper.Extract({ path: path+'/backend' })).on('close', ()=> {
            cleanupCallback();
            process.exit();
          });
        }));
      })
    });
  } catch(e) {
    console.log(e)
    process.exit();
  }
};
