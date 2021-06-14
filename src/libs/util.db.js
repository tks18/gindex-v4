import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import util from '@/libs/util'
import { cloneDeep } from 'lodash'

const adapter = new LocalStorage(`go2index-${process.env.VUE_APP_VERSION}`)
const db = low(adapter)

db
  .defaults({
    sys: {},
    database: {}
  })
  .write()

export default db

/**
*@description Check if the path exists and initialize if it does not exist
*@param {Object} payload dbName {String} database name
*@param {Object} payload path {String} path
*@param {Object} payload user {Boolean} distinguish users
*@param {Object} payload validator {Function} data verification hook returns true to indicate verification
*@param {Object} payload defaultValue {*} initial default value
*@returns {String} can be used directly
*/
export function pathInit ({
  dbName = 'database',
  path = '',
  user = true,
  validator = () => true,
  defaultValue = ''
}) {
  const uuid = util.cookies.get('uuid') || 'ghost-uuid'
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`
  const value = db.get(currentPath).value()
  if (!(value !== undefined && validator(value))) {
    db
      .set(currentPath, defaultValue)
      .write()
  }
  return currentPath
}

/**
*@description Store data to the specified location | The path does not exist will be automatically initialized
*@description is similar to the value dbName.path = value
*@param {Object} payload dbName {String} database name
*@param {Object} payload path {String} storage path
*@param {Object} payload value {*} The value to be stored
*@param {Object} payload user {Boolean} whether to distinguish users
*/
export function dbSet ({
  dbName = 'database',
  path = '',
  value = '',
  user = false
}) {
  db.set(pathInit({
    dbName,
    path,
    user
  }), value).write()
}

/**
*@description get data
*@description is similar to the value dbName.path || defaultValue
*@param {Object} payload dbName {String} database name
*@param {Object} payload path {String} storage path
*@param {Object} payload defaultValue {*} The default value of failed value
*@param {Object} payload user {Boolean} whether to distinguish users
*/
export function dbGet ({
  dbName = 'database',
  path = '',
  defaultValue = '',
  user = false
}) {
  return new Promise(resolve => {
    resolve(cloneDeep(db.get(pathInit({
      dbName,
      path,
      user,
      defaultValue
    })).value()))
  })
}

/**
*@description Get storage database object
*@param {Object} payload user {Boolean} whether to distinguish users
*/
export function database ({
  dbName = 'database',
  path = '',
  user = false,
  validator = () => true,
  defaultValue = ''
} = {}) {
  return new Promise(resolve => {
    resolve(db.get(pathInit({
      dbName, path, user, validator, defaultValue
    })))
  })
}
