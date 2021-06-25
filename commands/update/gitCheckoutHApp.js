const execa = require('execa');
const path = require('path');

module.exports = async (appname, cwdPath) => {
  let resPath = path.resolve(cwdPath);
  try {
    const result = await execa('heroku', ['git:remote','-a', appname], { cwd: resPath });
    if(!result.failed && !result.killed && !result.timedOut && !result.isCancelled){
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
