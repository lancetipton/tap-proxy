const { Logger } = require('@keg-hub/cli-utils')
const { getProxyRoutes } = require('../../utils/getProxyRoutes')
const { noOpObj, wordCaps, mapObj } = require('@keg-hub/jsutils')

/**
 * Logs the items returned from the traefik api to the terminal
 * @param {Array} items - Items returned from traefik api after being filtered
 *
 * @returns {Void}
 */
const logList = list => {
  Logger.subHeader(`[Keg-Proxy] Route-Table`)
  list.map(route => Logger.log(`  ${route.display}`))
  Logger.empty()
}

/**
 * Lists all containers registered to the keg-proxy
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Initial command being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {Object} globalConfig - Global config object for the keg-cli
 *
 * @returns {void}
 */
const listProxy = async args => {
  const { params, globalConfig } = args
  const { filter, env, host, log } = params

  const list = await getProxyRoutes(env, host, globalConfig)
  log && logList(list)

  return list
}

module.exports = {
  list: {
    name: 'list',
    alias: [ 'ls', 'print', 'pr' ],
    action: listProxy,
    description: `Lists the currently running containers and their URLs`,
    example: 'keg proxy list <options>',
    options: {
      filter: {
        description: 'Filter items displayed the printed list. Matching items will be shown',
        example: 'keg proxy list --filter proxy',
      },
      log: {
        alias: [ 'lg', 'print', 'pr' ],
        description: 'Print the items to the terminal',
        example: 'keg proxy list --no-log',
        default: true
      }
    }
  }
}
