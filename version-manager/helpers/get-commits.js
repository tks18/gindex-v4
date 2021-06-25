const axios = require('axios');

const token = process.env.GITHUB_TOKEN;

const api = (user, repo, branch) =>
  `https://tks18:${token}@api.github.com/repos/${user}/${repo}/commits?sha=${branch}`;

module.exports = async (user, repo, branch) => {
  const url = api(user, repo, branch);
  let result = {
    success: false,
    commit: false,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        const [latestCommit] = response.data;
        result['success'] = true;
        result['commit'] = latestCommit;
      }
      return result;
    })
    .catch((error) => {
      result['error'] = error;
      return result;
    });
  return response;
};
