'use strict';

require('./parts/common');
require('./parts/title');
require('./parts/excess');

module.exports = function(name) {
  return require('./core').exec(name);
};
