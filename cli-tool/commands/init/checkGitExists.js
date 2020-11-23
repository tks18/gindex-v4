const execa = require('execa');

module.exports = async () => {
  try {
    const result = await execa('git', ['--version']);
    const numRegex = /(git version).+/;
    if(numRegex.test(result.stdout)){
      return true;
    } else {
      return false;
    }
  } catch(e) {
    return false;
  }
};
