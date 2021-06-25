const axios = require('axios');

const token = process.env.GITHUB_TOKEN;

const api = (user, repo) =>
  `https://tks18:${token}@api.github.com/repos/${user}/${repo}/releases`;

module.exports = async (user, repo, versionToRelease) => {
  const url = api(user, repo);
  let result = {
    success: false,
    releases: false,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        const release_tags = response.data.map((release) => {
          return release.tag_name;
        });
        if (release_tags.includes(versionToRelease.tag.toLowerCase())) {
          result['success'] = false;
          result['releases'] = {
            exists: true,
          };
        } else {
          result['success'] = true;
          result['releases'] = {
            exists: false,
          };
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
