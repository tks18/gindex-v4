const execa = require('execa');

module.exports = async () => {
  try {
    const result = await execa('npm', ['i', '-g', 'heroku']);
    if(result.stderr == '' && !result.failed && !result.killed && !result.timedOut && !result.isCancelled){
      return {
        res: true,
        output: result.stdout,
        cmd: result.command,
        exitCode: result.exitCode
      }
    } else {
      return {
        res: false,
        output: result.stderr,
        cmd: result.command,
        exitCode: result.exitCode
      }
    }
  } catch(e) {
    return {
      res: false,
      output: e.stderr,
      cmd: e.command,
      exitCode: e.exitCode
    }
  }
}
