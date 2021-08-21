const open = require('open')
const { ask } = require('KegRepos/ask-it')
const { Logger } = require('@keg-hub/cli-utils')
const { getProxyRoutes } = require('../../utils/getProxyRoutes')

/**
 * Asks the user to select a route from a list of routes
 * @param {Array} routes - Routes returned from keg-proxy api
 *
 * @returns {Object} - Selected item from the list of passed in items
 */
const askForRoute = async routes => {
  const urls = []

  const index = await ask.promptList(
    routes.map(({ url, display }) => {
      urls.push(url)

      return display
    }),
    'Proxy Routes: ( Name | URL )',
    'Select a Route:'
  )

  return urls[index]
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
const openProxy = async args => {
  const { params, globalConfig } = args
  const { context, env } = params

  const list = await getProxyRoutes(env)
  const url = await askForRoute(list, globalConfig, env)

  return url
    ? await open(url)
    : Logger.warn(`\nNo route found, skipping!\n`)
}

module.exports = {
  open: {
    name: 'open',
    alias: [ 'op' ],
    action: openProxy,
    description: `Open a proxy route with the host machines default browser`,
    example: 'keg proxy open <options>',
    options: {
      context: {
        description: 'Nam of the proxy route to open. Can be a partial name',
        example: 'keg proxy open --context components',
      },
    }
  }
}
