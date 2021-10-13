const axios = require('axios');
const frontendRegex = /^(frontend).+/;

module.exports = async () => {
  return axios
    .get('https://api.github.com/repos/tks18/gindex-v4/releases')
    .then((resp) => {
      const result = resp.data.filter((releases) => {
        return frontendRegex.test(releases.tag_name) && !releases.prerelease;
      })[0].tag_name;
      return axios
        .get(
          `https://raw.githubusercontent.com/tks18/gindex-v4/master/worker/index.js`,
        )
        .then((resp) => {
          replacedVersion = result.replace(/^(frontend-)/, '');
          return {
            version: result,
            verNumber: replacedVersion,
            code: resp.data,
          };
        });
    });
};
