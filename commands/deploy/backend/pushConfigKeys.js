const execa = require('execa');
const path = require('path');

module.exports = async (appname, cwdPath, configObj) => {
  const backPath = path.resolve(cwdPath);
  try {
    const result = await execa(`heroku`,[`config:set`,`-a`,appname,`DBURL=${configObj.dburl}`,`SITE=${configObj.site}`,`EMAILID=${configObj.emailid}`,`EMAILPASS=${configObj.emailpass}`,`EMAILPORT=${configObj.emailport}`,`EMAILSERVICE=${configObj.emailservice}`,`EMAILSMTP=${configObj.emailsmtp}`,`ADMINEMAIL=${configObj.adminemail}`,`REPLYTOMAIL=${configObj.replyemail}`,`MAXSESSIONS=${configObj.maxsessions}`,`EMAILGIF=${configObj.emailgif}`,`SITESECRET=${configObj.sitesec}`,`TMDBAPI=${configObj.tmdbapi}`,`FRONTENDURL=${configObj.fronturls}`,`FRONTENDSITENAME=${configObj.frontname}`,`TOKENSECRET=${configObj.tokensec}`], { cwd: backPath });
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
