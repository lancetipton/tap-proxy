const { config } = require('PRConfig')
const { Logger } = require('PRUtils/logger')
const {
  resolveIP,
  buildRoute,
  formatName,
  resolveName,
  resolvePort,
  isValidRoute,
  getContainers,
} = require('./helpers')

/**
 * RouteTable
 * @summery - Uses dockerode, to find all running containers, and get their routing information
 *            Then caches that information to allow looking it up at a later time
 * @type {class}
 * @param {Object} containerObj - Meta data of a running container
 *
 * @returns {Promise<route>} - Route object with port, name, and address properties
 */
class RouteTable {

  routes = {}
  invalid = {}

  constructor(conf){
    this.config = conf
    this.updateRoutes()
    // Update routing table based on config internal or every 10 seconds
    setInterval(this.updateRoutes.bind(this), this.config.updateInterval || 10000) 
  }

  /**
   * Gets the current routes of the RouteTable
   * @function
   * @memberof RouteTable
   *
   * @returns {Object} - Route matching the passed in name
   */
  getRoute = name => {
    return this.routes[name]
  }

  /**
   * Gets all found routes of the RouteTable
   * @function
   * @memberof RouteTable
   *
   * @returns {Object} - All found routes built from running containers
   */
  getRoutes = () => {
    return this.routes
  }

  /**
   * Updates the routes object with routes built from all running containers
   * @function
   * @memberof RouteTable
   *
   * @returns {void}
   */
  updateRoutes = async () => {
    Logger.info(`Running routes update...`)

    const containers = await getContainers()

    const promiseRoutes = containers.reduce(async (toResolve, containerObj) => {
      const routes = await toResolve

      if(!containerObj) return routes

      const route = await buildRoute(containerObj, this.config)
      const containerName = formatName(containerObj)
      // Validate the route and properties
      if(!isValidRoute(containerName, route, this.invalid))
        return routes

      // If it was invalid previously, then remove it
      if(this.invalid[containerName]) delete this.invalid[containerName]

      const current = this.routes[route.name]

      typeof current === 'undefined'
        ? Logger.pair(`[RouteTable] Adding container route:`, route.name)
        : (current.address !== route.address || current.port !== route.port)
            && Logger.pair('[RouteTable] Updating container route:', route.name)

      routes[route.name] = { ...current, ...route }

      return routes
    }, Promise.resolve({}))
    
    this.routes = await promiseRoutes
  }

}

const RT = new RouteTable(config)

module.exports = {
  RouteTable: RT
}