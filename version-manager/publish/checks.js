const checkRepoBranch = require('../helpers/branch-check');
const checkUser = require('../helpers/user-check');
const checkRepo = require('../helpers/repo-check');
const spinner = require('../helpers/spinner');

module.exports = async (args) => {
  const repoRegex = /(?<server>https:\/\/github.com)\/(?<user>[a-zA-Z0-9].*)\/(?<repo>[a-zA-Z0-9].*)/;
  const { repo: repoSlug, branch, dev } = args;
  let result = {};
  if (repoSlug && repoRegex.test(repoSlug)) {
    result['passes'] = true;
    const { server, user, repo } = repoSlug.match(repoRegex).groups;
    result['server'] = server;
    result['user'] = {
      name: user,
    };
    result['repo'] = {
      name: repo,
    };
    result['branch'] = {
      name: branch,
    };
    const userCheck = await checkUser(user);
    console.log(userCheck);
    if (userCheck.success) {
      result['user']['exists'] = true;
    } else {
      result['user']['exists'] = false;
    }
    const repoCheck = await checkRepo(user, repo);
    if (repoCheck.success) {
      result['repo']['exists'] = true;
    } else {
      result['repo']['exists'] = false;
    }
    const branchCheck = await checkRepoBranch(user, repo, branch);
    if (branchCheck.success) {
      result['branch']['exists'] = true;
    } else {
      result['branch']['exists'] = false;
    }
  } else {
    result['passes'] = false;
  }
  if (dev) {
    result['dev'] = true;
  } else {
    result['dev'] = false;
  }
  return result;
};
