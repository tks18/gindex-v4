const execa = require('execa');
const path = require('path');

module.exports = async (cwdPath) => {
  const backPath = path.resolve(cwdPath);
  try {
    const result = await execa('git', ['push','heroku', 'master', '--force'], { cwd: backPath });
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
}
