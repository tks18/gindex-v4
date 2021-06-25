const axios = require('axios');

const token = process.env.GITHUB_TOKEN;

const api = (user, repo, commit) =>
  `https://tks18:${token}@api.github.com/repos/${user}/${repo}/commits/${commit}`;

module.exports = async (user, repo, commit) => {
  const url = api(user, repo, commit);
  let result = {
    success: false,
    changelog: null,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        const { stats, files } = response.data;
        mappedFiles = files.map((file) => {
          return {
            name: file.filename,
            sha: file.sha,
            status: file.status,
          };
        });
        result['changelog'] = {
          stats,
          files: mappedFiles,
        };
        result['success'] = true;
      }
      return result;
    })
    .catch((error) => {
      result['error'] = error;
      return result;
    });
  return response;
};
