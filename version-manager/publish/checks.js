module.exports = (args, releaseTypes) => {
  const repoRegex = /(?<server>https:\/\/github.com)\/(?<user>[a-zA-Z0-9].*)\/(?<repo>[a-zA-Z0-9].*)/;
  const { repo: repoSlug, branch, dev, type } = args;
  let result = {};
  if (repoSlug && repoRegex.test(repoSlug)) {
    result['passes'] = true;
    const { server, user, repo } = repoSlug.match(repoRegex).groups;
    result['server'] = server;
    result['user'] = user;
    result['repo'] = repo;
    result['branch'] = branch;
    if (dev) {
      result['dev'] = true;
    } else {
      result['dev'] = false;
    }
    for (const releaseType in releaseTypes) {
      if (type.toLowerCase() === releaseType.toLowerCase()) {
        result['version'] = {
          exists: true,
        };
        result.version = {
          ...result.version,
          ...releaseTypes[releaseType],
        };
      }
    }
  } else {
    result['passes'] = false;
  }
  return result;
};
