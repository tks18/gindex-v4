const Conf = require('conf');

const schema = {
  name: {
    type: 'string',
    default: 'Anonymous'
  },
  init: {
    type: "object",
    properties: {
      checked: {
        type: 'boolean',
        default: false
      },
      git: {
        type: 'object',
        default: {},
      },
      npm: {
        type: 'object',
        default: {},
      },
      heroku: {
        type: 'object',
        default: {},
      },
    }
  }
}

const config = new Conf({schema});
module.exports = config
