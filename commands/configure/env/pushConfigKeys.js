const execa = require('execa');

module.exports = async (appname, configObj) => {
  try {
    const result = await execa(`heroku`,[`config:set`,`-a`,appname,`${configObj.envName}=${configObj.envVal}`,]);
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
