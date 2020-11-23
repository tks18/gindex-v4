const execa = require('execa');

module.exports = async () => {
  try {
    const result = await execa('npm', ['--v']);
    const numRegex = /([1-9]).+/;
    if(numRegex.test(result.stdout)){
      return true;
    } else {
      return false;
    }
  } catch(e) {
    return false;
  }
};
