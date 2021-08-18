const Docker = require('dockerode')
const { config } = require('PRConfig')
const { Logger } = require('@keg-hub/cli-utils')
const { limbo, get } = require('@keg-hub/jsutils')
const docker = new Docker()


/**
 * Wraps a method with a callback into a promise
 * @function
 * @private
 * @param {*} cb - method to wrap in a promise
 * @param {*} args - Arguments to pass to the callback method
 *
 * @returns {Promise|*} - Success response of fs.rename method
 */
const limboify = (cb, ...args) => {
  return limbo(
    new Promise((res, rej) =>
      cb(...args, (err, success) => (err ? rej(err) : res(success || true)))
    )
  )
}

const resolveName = (containerObj, config) => {
  const name = get(containerObj, `Names.0`, '').substring(1)
    
  // TODO - Check for prefixes, img and package, then remove them if needed
  // Need to add labels to proxy config
  return name
    .replace(/^package-/, '')
    .replace(/^img-/, '')
}

const resolvePort = async (containerObj, config) => {
  // Check the container ENVs
  const container = docker.getContainer(containerObj.Id)
  const [insErr, inspectObj] = await limboify(container.inspect.bind(container))
  if(insErr) return console.error(insErr)

  // TODO - Convert KEG_PROXY_PORT to config value

  const envPort = get(inspectObj, `Config.Env.KEG_PROXY_PORT`)
  if(envPort) return envPort

  // Check the container labels
  const labelsObj = get(containerObj, `Labels`, {})
  // TODO - Convert com.keg.env.port to config value
  const labelPort = labelsObj['com.keg.env.port']
  if(labelPort) return labelPort

  // Check the ports object
  const privatePort = get(containerObj, `Ports.0.PrivatePort`)
  if(privatePort) return privatePort

}

const resolveIP = (containerObj, config) => {
  const networkName = get(containerObj, 'HostConfig.NetworkMode', '')
  const network = networkName && get(containerObj, `NetworkSettings.Networks.${networkName}`, {})
  const ip = network && network.IPAddress

  // TODO: figure out if we can just use the containers ID
  // Docker does some internal setup with DNS, and each containers host file
  // We maybe able to use this, and make container look up easier
  return ip
}

/**
 * Builds an route entry from the passed in container object
 * @function
 * @private
 * @param {Object} containerObj - Meta data of a running container
 *
 * @returns {Promise<route>} - Route object with port, name, and address properties
 */
const buildRoute = async containerObj => {
  const name = resolveName(containerObj)
  const address = resolveIP(containerObj)
  const port = await resolvePort(containerObj)

  return {
    port: port,
    name: name,
    address: address,
  }
}

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

  constructor(conf){
    this.config = conf
    this.updateRoutes()
    // update routing table every 10 seconds
    setInterval(this.updateRoutes, this.config.updateInterval || 10000) 
  }

  /**
   * Gets the current routes of the RouteTable
   * @function
   * @memberof RouteTable
   *
   * @returns {Object} - All found routes built from running containers
   */
  getRoute = name => {
    return this.routes[name]
  }

  /**
   * Updates the routes object with routes built from all running containers
   * @function
   * @memberof RouteTable
   *
   * @returns {void}
   */
  updateRoutes = async () => {
    const [contErr, containers] = await limboify(docker.listContainers.bind(docker))

    const promiseRoutes = containers.reduce(async (toResolve, containerObj) => {
      const routes = await toResolve

      if(!containerObj) return routes

      const route = await buildRoute(containerObj)
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