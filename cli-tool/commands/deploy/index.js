const checkHerokuLogin = require('./checkHerokuLogin');
const createHerokuApp = require('./createHerokuApp');
const gitCheckoutHApp = require('./gitCheckoutHApp');
const downloadUnzipBackend = require('./downloadUnzipBackend');
const inputPrompts = require('./inputPrompts');

module.exports = async () => {
  downloadUnzipBackend();
}
