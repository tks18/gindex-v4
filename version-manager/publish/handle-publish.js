const preChecks = require('./checks');

module.exports = (args, yargs) => {
  const checkResult = preChecks(args);
  console.log(checkResult);
};
