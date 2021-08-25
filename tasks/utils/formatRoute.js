const { getDomain } = require('./getDomain')
const { wordCaps, get } = require('@keg-hub/jsutils')
const { Logger, getKegGlobalConfig } = require('@keg-hub/cli-utils')

/**
 * Formats the passed in routes while also creating the URL from the proxy host
 * @param {Object} route - Route object return from the tap-proxy api 
 * @param {string} env - The env the tap-proxy was started in
 * @param {string} host - Domain when the proxy is running
 * @param {Object} [globalConfig] - Keg-Cli globalConfig
 *
 * @returns {Object} - Contains route url and display
 */
const formatRoute = ({ name }, env, host, globalConfig) => {
  globalConfig = globalConfig || getKegGlobalConfig()

  const domain = getDomain(env, host, globalConfig)
  const url = `http://${name}.${domain}`
  const formattedName = wordCaps(name).split(' ').join('-')
  return { url, display: `${Logger.colors.green(formattedName)} => ${Logger.colors.blue(url)}`}
}

module.exports = {
  formatRoute
}