const { env } = require('./configure');
const { backend, frontend } = require('./deploy');

exports.init = require('./init');
exports.update = require('./update');
exports.configure = {
  env: env
}
exports.deploy = {
  backend: backend,
  frontend: frontend
}
