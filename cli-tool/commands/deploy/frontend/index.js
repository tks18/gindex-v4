const installWrangler = require('./installWrangler');
const inputPrompts = require('./inputPrompts');

module.exports = async () => {
  const summa = await inputPrompts.getAllKeys()
  console.log(summa);
}
