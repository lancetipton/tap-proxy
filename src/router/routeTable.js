const Docker = require('dockerode')
const { config } = require('PRConfig')
const { limbo } = require('@keg-hub/jsutils')
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

/**
 * Builds an route entry from the passed in container object
 * @function
 * @private
 * @param {Object} containerObj - Meta data of a running container
 *
 * @returns {Promise<route>} - Route object with port, name, and address properties
 */
const buildRoute = async containerObj => {
  // TODO: update to parse out the subdomain and prot
  const name = containerObj.Names[0].substring(1)
  const port = containerObj.Ports[0].PrivatePort
  
  const container = docker.getContainer(containerObj.Id)
  const [inspErr, inspectObj] = await limboify(container.inspect)
  
  // TODO: update to parse out the correct ip address
  const address = inspectObj.NetworkSettings.IPAddress
  
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
    console.log(`---------- update routes ----------`)
    // const containers = await limboify(docker.listContainers)
    // const promiseRoutes = containers.reduce(async (toResolve, containerObj) => {
    //   const routes = await toResolve

    //   const route = await buildRoute(containerObj)
    //   const current = this.routes[route.name]

    //   typeof current === 'undefined'
    //     ? Logger.pair(`[RouteTable] Adding container route:`, route.name)
    //     : (current.address !== route.address || current.port !== route.port)
    //         && Logger.pair('[RouteTable] Updating container route:', route.name)

    //   routes[name] = {
    //     ...current,
    //     name: name,
    //     address: address,
    //     port: port
    //   }

    //   return routes
    // }, Promise.resolve({}))
    
    // this.routes = await promiseRoutes 
  }

  __updateRoutes = () => {
    docker.listContainers((err, containers) => {
      containers.forEach((containerInfo) => {
        // TODO: update to parse out the subdomain and prot
        const name = containerInfo.Names[0].substring(1)
        const port = containerInfo.Ports[0].PrivatePort
        
        const container = docker.getContainer(containerInfo.Id)
        container.inspect((err, data)=> {
          // TODO: update to parse out the correct ip address
          const address = data.NetworkSettings.IPAddress

          ;(typeof this.routes[name] === 'undefined') &&
            Logger.info('Adding new route:', name)
          
          ;(this.routes[name].address !== address || this.routes[name].port !== port) &&
            Logger.info('Updating route:', name)

          this.routes[name] = {
            name: name,
            address: address,
            port: port
          }

        })
      })
    })
  }

}

const RT = new RouteTable(config)

module.exports = {
  RouteTable: RT
}