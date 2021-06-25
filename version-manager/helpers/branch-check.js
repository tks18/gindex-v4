const axios = require('axios');

const token = process.env.GITHUB_TOKEN;

const api = (user, repo) =>
  `https://tks18:${token}@api.github.com/repos/${user}/${repo}/branches`;

module.exports = async (user, repo, branch) => {
  const url = api(user, repo);
  let result = {
    success: false,
    branch: false,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        const branches = response.data.map((respBranches) => respBranches.name);
        if (branches.includes(branch.toLowerCase())) {
          result['success'] = true;
          result['branch'] = true;
          return result;
        }
      }
      return result;
    })
    .catch((error) => {
      result['error'] = error;
      return result;
    });
  return response;
};
