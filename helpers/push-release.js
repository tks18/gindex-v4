const axios = require('axios');

const token = process.env.GITHUB_TOKEN;

const api = (user, repo) =>
  `https://tks18:${token}@api.github.com/repos/${user}/${repo}/releases`;

module.exports = async (
  user,
  repo,
  name,
  version,
  branch,
  body,
  prerelease,
) => {
  const url = api(user, repo);
  let result = {
    success: false,
    commit: null,
    error: null,
  };
  const response = await axios
    .post(
      url,
      {
        name,
        body,
        owner: user,
        repo,
        prerelease,
        tag_name: version.tag,
        target_commitish: branch,
      },
      {
        Headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      },
    )
    .then((resp) => {
      if (resp.status == 200 && resp.data) {
        result['commit'] = resp.data;
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
