import router from '@/router'
import { cloneDeep } from 'lodash'
import { database as getDatabase, dbGet, dbSet } from '@/libs/util.db'

export default {
  namespaced: true,
  actions: {
/**
*@description Store data to the specified location | The path does not exist will be automatically initialized
*@description is similar to the value dbName.path = value
*@param {Object} context
*@param {Object} payload dbName {String} database name
*@param {Object} payload path {String} storage path
*@param {Object} payload value {*} The value to be stored
*@param {Object} payload user {Boolean} whether to distinguish users
*/
    set (context, {
      dbName = 'database',
      path = '',
      value = '',
      user = false
    }) {
      dbSet({ dbName, path, value, user })
    },
    /**
    *@description get data
    *@description is similar to the value dbName.path || defaultValue
    *@param {Object} context
    *@param {Object} payload dbName {String} database name
    *@param {Object} payload path {String} storage path
    *@param {Object} payload defaultValue {*} The default value of failed value
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    get (context, {
      dbName = 'database',
      path = '',
      defaultValue = '',
      user = false
    }) {
      return dbGet({ dbName, path, defaultValue, user })
    },
    /**
    *@description Get storage database object
    *@param {Object} context
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    database (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        defaultValue: {}
      })
    },
    /**
    *@description Clear storage database objects
    *@param {Object} context
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    databaseClear (context, {
      user = false
    } = {}) {
      return getDatabase({
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
    *@description Get storage database object [different page]
    *@param {Object} context
    *@param {Object} payload basis {String} page distinction basis [name | path | fullPath]
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    databasePage (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        defaultValue: {}
      })
    },
    /**
    *@description clear storage database object [different page]
    *@param {Object} context
    *@param {Object} payload basis {String} page distinction basis [name | path | fullPath]
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    databasePageClear (context, {
      basis = 'fullPath',
      user = false
    } = {}) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    },
    /**
    *@description quickly persist the current data of the page ($data)
    *@param {Object} context
    *@param {Object} payload instance {Object} vue instance
    *@param {Object} payload basis {String} page distinction basis [name | path | fullPath]
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    pageSet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
    *@description quickly get the data of the page fast and persistent
    *@param {Object} context
    *@param {Object} payload instance {Object} vue instance
    *@param {Object} payload basis {String} page distinction basis [name | path | fullPath]
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    pageGet (context, {
      instance,
      basis = 'fullPath',
      user = false
    }) {
      return dbGet({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        defaultValue: cloneDeep(instance.$data)
      })
    },
    /**
    *@description Clear page snapshot
    *@param {Object} context
    *@param {Object} payload basis {String} page distinction basis [name | path | fullPath]
    *@param {Object} payload user {Boolean} whether to distinguish users
    */
    pageClear (context, {
      basis = 'fullPath',
      user = false
    }) {
      return getDatabase({
        path: `$page.${router.app.$route[basis]}.$data`,
        user,
        validator: () => false,
        defaultValue: {}
      })
    }
  }
}
