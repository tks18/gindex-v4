const execa = require('execa');

module.exports = async (appname) => {
  try {
    const result = await execa('heroku', ['git:remote','-a', appname]);
    const tokenRegex = new RegExp('set git remote heroku to https://git.heroku.com/'+appname+'.git done');
    if(tokenRegex.test(result.stdout)){
      return {
        res: true,
        output: result.stdout+'\n'+result.stderr,
        cmd: result.command,
        exitCode: result.exitCode
      };
    } else {
      return {
        res: false,
        output: result.stdout+'\n'+result.stderr,
        cmd: result.command,
        exitCode: result.exitCode
      };
    }
  } catch(e) {
    return {
      res: false,
      output: e.stdout+'\n'+e.stderr,
      cmd: e.command,
      exitCode: e.exitCode
    };
  }
};
