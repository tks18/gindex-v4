const execa = require('execa');
const path = require('path');

module.exports = async (backPath) => {
  try {
    let cwdPath = path.normalize(path.resolve(backPath));
    const gitInit = await execa('git', ['init'], {cwd: cwdPath});
    if(!gitInit.failed && !gitInit.killed && !gitInit.timedOut && !gitInit.isCancelled){
      const gitAdd = await execa('git', ['add', '.'], {cwd: cwdPath});
      if(!gitAdd.failed && !gitAdd.killed && !gitAdd.timedOut && !gitAdd.isCancelled){
        const gitCommit = await execa('git', ['commit', '-m', '%Automated Bot Commit%'],{cwd: cwdPath});
        if(!gitCommit.failed && !gitCommit.killed && !gitCommit.timedOut && !gitCommit.isCancelled){
          return {
            res: true,
            initOut: gitInit.stdout,
            addOut: gitAdd.stdout,
            commitOut: gitCommit.stdout,
            commands: {
              init: gitInit.command,
              add: gitAdd.command,
              commit: gitCommit.command
            },
            exitCodes: {
              init: gitInit.exitCode,
              add: gitAdd.exitCode,
              commit: gitCommit.exitCode
            }
          }
        } else {
          return {
            res: false,
            initOut: gitInit.stdout,
            addOut: gitAdd.stdout,
            commitOut: gitCommit.stderr,
            commands: {
              init: gitInit.command,
              add: gitAdd.command,
              commit: gitCommit.command
            },
            exitCodes: {
              init: gitInit.exitCode,
              add: gitAdd.exitCode,
              commit: gitCommit.exitCode
            }
          }
        }
      } else {
        return {
          res: false,
          initOut: gitInit.stdout,
          addOut: gitAdd.stderr,
          commitOut: 'Not Executed',
          commands: {
            init: gitInit.command,
            add: gitAdd.command,
            commit: "Not Executed"
          },
          exitCodes: {
            init: gitInit.exitCode,
            add: gitAdd.exitCode,
            commit: "Not Executed"
          }
        }
      }
    } else {
      return {
        res: false,
        initOut: gitInit.stderr,
        addOut: "Not Executed",
        commitOut: "Not Executed",
        commands: {
          init: gitInit.command,
          add: "Not Executed",
          commit: "Not Executed"
        },
        exitCodes: {
          init: gitInit.exitCode,
          add: "Not Executed",
          commit: "Not Executed"
        }
      }
    }
  } catch(e) {
    console.log(e);
    return {
      res: false,
      initOut: e.stderr,
      addOut: e.stderr,
      commitOut: e.stderr,
      commands: {
        init: e.command,
        add: e.command,
        commit: e.command
      },
      exitCodes: {
        init: e.exitCode,
        add: e.exitCode,
        commit: e.exitCode
      }
    }
  }
}
