const axios = require('axios');

const api = (user) => `https://api.github.com/users/${user}`;

module.exports = async (user) => {
  const url = api(user);
  let result = {
    success: false,
    user: false,
    error: null,
  };
  const response = await axios
    .get(url)
    .then((response) => {
      if (response.status == 200 && response.data) {
        result['success'] = true;
        result['user'] = true;
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
