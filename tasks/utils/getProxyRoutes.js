const axios = require('axios')
const { getDomain } = require('./getDomain')
const { formatRoute } = require('./formatRoute')
const { limbo, isArr, get } = require('@keg-hub/jsutils')
const { error, getKegGlobalConfig } = require('@keg-hub/cli-utils')

/**
 * Gets a list of all containers registered to the keg-proxy
 * @param {string} env - The env the keg-proxy was started in
 * @param {string} host - Domain when the proxy is running
 * @param {Object} [globalConfig] - Keg-Cli globalConfig
 *
 * @returns {Array} - List of container routes from keg-proxy
 */
const getProxyRoutes = async (env, host, globalConfig) => {
  globalConfig = globalConfig || getKegGlobalConfig()
  const domain = getDomain(env, host, globalConfig)

  const [ err, res ] = await limbo(axios.get(`http://${domain}/keg-proxy/routes`))

  const routes = err
    ? error.throwError(err.message)
    : isArr(res.data)
      ? res.data
      : error.throwError(`No routes returned from the proxy server!`) ||
          (res && console.log(res.data))

  return routes.map(route => ({
    ...formatRoute(route, env, host, globalConfig),
    ...route,
  }))
}

module.exports = {
  getProxyRoutes
}