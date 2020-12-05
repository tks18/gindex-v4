const { env } = require('./configure');

exports.init = require('./init');
exports.deploy = require('./deploy');
exports.update = require('./update');
exports.configure = {
  env: env
}
