const open = require('open')
const { Logger } = require('@keg-hub/cli-utils')
const { ask } = require('KegRepos/ask-it')
const { wordCaps } = require('@keg-hub/jsutils')
const { getProxyRoutes } = require('KegUtils/proxy/getProxyRoutes')
const { filterProxyRoutes } = require('KegUtils/proxy/filterProxyRoutes')

/**
 * Asks the user to select a route from a list of routes
 * @param {Array} items - Items returned from traefik api after being filtered
 *
 * @returns {Object} - Selected item from the list of passed in items
 */
const askForRoute = async items => {
  // const index = await ask.promptList(
  //   items.map(item => {
  //     const [ name, ...rest ] = item.service.split('-')
  //     const branch = rest.length ? `-${rest.join('-')}\n` : '\n'
  //     const url = `       * http://${item.rule.split('`')[1]}\n`

  //     return `${wordCaps(name)}${branch}${url}`
  //   }),
  //   'Proxy Routes: ( Route | URL )\n',
  //   'Select a Route:'
  // )
  // return items[index]
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
  const { params } = args
  const { context, env } = params

  const list = await getProxyRoutes(env)
  // TODO - update to work with new proxy response
  
  // const filtered = filterProxyRoutes(list, context)

  // !filtered.length &&
  //   context &&
  //   Logger.warn(`\nCould not find any routes for ${context}!\n`)

  // const item = filtered.length > 1
  //     ? await askForRoute(filtered)
  //     : filtered.pop()

  // const url = item && item.rule.split('`')[1]

  // return url
  //   ? await open(`http://${url}`)
  //   : Logger.warn(`\nNo route found, skipping!\n`)
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
