const axios = require('axios')
const { limbo, isArr, get } = require('@keg-hub/jsutils')
const { error, getKegGlobalConfig } = require('@keg-hub/cli-utils')

/**
 * Gets a list of all containers registered to the keg-node-proxy
 * @param {string} env - The env the keg-node-proxy was started in
 * @param {string} host - Domain when the proxy is running
 * @param {Object} [globalConfig] - Keg-Cli globalConfig
 *
 * @returns {Array} - List of container routes from keg-node-proxy
 */
const getProxyRoutes = async (env, host, globalConfig) => {
  globalConfig = globalConfig || getKegGlobalConfig()

  const domain = host || get(globalConfig, `cli.settings.defaultDomain`)
  const subdomain = env || get(globalConfig, `cli.settings.defaultEnv`)
  const [ err, res ] = await limbo(axios.get(`http://${subdomain}.${domain}/__api/proxy/routetable`))

  return err
    ? error.throwError(err.message)
    : !isArr(res.data)
      ? generalError(`No routes returned from the proxy server!`, res)
      : res.data
}

module.exports = {
  getProxyRoutes
}