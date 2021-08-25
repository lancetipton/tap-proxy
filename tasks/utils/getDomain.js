const { get } = require('@keg-hub/jsutils')
const { getKegGlobalConfig } = require('@keg-hub/cli-utils')

/**
 * Gets the domain for route based on the env, host, and keg-cli globalConfig
 * @param {string} env - The env the tap-proxy was started in
 * @param {string} host - Domain when the proxy is running
 * @param {Object} [globalConfig] - Keg-Cli globalConfig
 *
 * @returns {string} - Routes domain
 */
const getDomain = (env, host, globalConfig) => {
  globalConfig = globalConfig || getKegGlobalConfig()
  env = env || get(globalConfig, 'cli.settings.defaultEnv')

  const domain = host ||
    process.env.KEG_PROXY_HOST ||
    get(globalConfig, 'cli.settings.defaultDomain', 'local.keghub.io')

  const domArr = domain.split('.')
  // Ensure the fist item in the domain array is the same as the current env
  domArr.length === 3 ? (domArr[0] = env) : domArr.unshift(env)
  
  return domArr.join('.')
}


module.exports = {
  getDomain
}