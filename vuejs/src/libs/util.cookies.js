import Cookies from 'js-cookie'

const cookies = {}

/**
 * @description gets the cookie value
 * @param {String} name cookie name
 * @param {String} value cookie value
 * @param {Object} setting cookie setting
 */
cookies.set = function (name = 'default', value = '', cookieSetting = {}) {
  let currentCookieSetting = {
    expires: 1
  }
  Object.assign(currentCookieSetting, cookieSetting)
  Cookies.set(`go2index-${process.env.VUE_APP_VERSION}-${name}`, value, currentCookieSetting)
}

/**
* @description gets the cookie value
* @param {String} name cookie name
*/
cookies.get = function (name = 'default') {
  return Cookies.get(`go2index-${process.env.VUE_APP_VERSION}-${name}`)
}

/**
* @description gets the entire value of the cookie
*/
cookies.getAll = function () {
  return Cookies.get()
}

/**
* @description get the cookie value
* @param {String} name cookie name
*/
cookies.remove = function (name = 'default') {
  return Cookies.remove(`go2index-${process.env.VUE_APP_VERSION}-${name}`)
}

export default cookies
