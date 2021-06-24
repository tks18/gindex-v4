const axios = require('axios');

const api = (user, repo) => `https://api.github.com/repos/${user}/${repo}`;

module.exports = async (user, repo) => {
  const url = api(user, repo);
  let result = {
    success: false,
    repo: false,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        result['success'] = true;
        result['repo'] = true;
        return result;
      }
      return result;
    })
    .catch((error) => {
      result['error'] = error;
      return result;
    });
  return response;
};
