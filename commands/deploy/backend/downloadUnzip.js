const unzipper = require('unzipper');
const fs = require('fs');
const axios = require('axios');
const release = require('./getReleases');

module.exports = async (path, exfunc) => {
  let latVerUrl = await release();
  return axios({
      method: "get",
      url: `https://github.com/tks18/gindex-v4/releases/download/${latVerUrl.tag_name}/${latVerUrl.assets[0].name}`,
      responseType: "stream"
  }).then(resp => {
    resp.data.pipe(fs.createWriteStream(path+"/latest.zip").on('finish', () => {
      fs.createReadStream(path+"/latest.zip").pipe(unzipper.Extract({ path: path+'/backend' })).on('close', ()=> {
        exfunc();
      });
    }));
  }).catch(e => {
    return {
      res: false,
      output: e
    }
  })

}
