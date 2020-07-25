import cookies from './util.cookies'
import db from './util.db'
// import log from './util.log'

const util = {
  cookies,
  db,
  // log
}

/**
* @description update title
* @param {String} title
*/
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || 'GoIndex'
  window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ''}`
}

/**
*@description Open a new page
*@param {String} url address
*/
util.open = function (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('target', '_blank')
  a.setAttribute('id', 'd2admin-link-temp')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(document.getElementById('d2admin-link-temp'))
}

export default util
