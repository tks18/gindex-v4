const checkHerokuLogin = require('./checkHerokuLogin');
const createHerokuApp = require('./createHerokuApp');
const gitCheckoutHApp = require('./gitCheckoutHApp');
const downloadUnzipBackend = require('./downloadUnzipBackend');
const initBackendnCommit = require('./initBackendnCommit');
const inputPrompts = require('./inputPrompts');

module.exports = async () => {
  const summa = await initBackendnCommit('C:/asdsad');
  console.log(summa);
}
