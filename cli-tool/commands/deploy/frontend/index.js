const installWrangler = require('./installWrangler');
const getLatIndex = require('./getLatIndex');
const replaceOpt = require('./replaceOpt');
const inputPrompts = require('./inputPrompts');

module.exports = async () => {
  const summa = await getLatIndex()
  let summasdasd = ["asdasd","asdasd","asdasd","asdasd"]
  let stringthat = "";
  summasdasd.forEach((item, i) => {
    stringthat += `{
      id: "${item}",
      name: "${item}",
      protect_file_link: true
    },`
  });
  const summa1 = await replaceOpt(summa, stringthat)
}
