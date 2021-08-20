const Docker = require('dockerode')
const { logInvalidRoute, logError } = require('PRUtils/logger')
const { limbo, get, noOpObj, noPropArr } = require('@keg-hub/jsutils')

/**
 * Instance of the Docker API from dockerode
 * @type {Object}
 */
const docker = new Docker()

/**
 * Formats the name of the passed in container Object
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 *
 * @returns {string} - Formatted name of the container
 */
const formatName = (containerObj=noOpObj) => get(containerObj, `Names.0`, '').substring(1)

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
 * Calls docker to get the current containers
 * @function
 * @public
 *
 * @returns {Array<Objects>} - Existing containers in docker
 */
const getContainers = async () => {
  const [contErr, containers] = await limboify(docker.listContainers.bind(docker))
  if(!contErr) return containers
  
  logError(contErr)
  return noPropArr
}

/**
 * Formats the name of the passed in container Object
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 *
 * @returns {string} - Formatted name of the container
 */
const resolveName = (containerObj, config) => {
  const name = formatName(containerObj)
    
  // TODO - Check for prefixes, img and package, then remove them if needed
  // Need to add labels to proxy config
  return name
    .replace(/^package-/, '')
    .replace(/^img-/, '')
}

/**
 * Finds the port for the route based on the containerObj, and config
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 * @param {Object} config - Global keg-proxy config
 *
 * @returns {string|number} - Found port or null
 */
const resolvePort = async (containerObj, config) => {
  // Check the container ENVs
  const container = docker.getContainer(containerObj.Id)
  const [insErr, inspectObj] = await limboify(container.inspect.bind(container))
  if(insErr) return console.error(insErr)

  // Get the config for finding the port
  const portFrom = get(config, 'container.portFrom', noOpObj)

  // Pull the port from a container ENV
  const envPort = portFrom.env && get(inspectObj, `Config.Env.${portFrom.env}`)
  if(envPort) return envPort

  // Pull the port from a container label
  const labelsObj = get(containerObj, `Labels`, {})
  const labelPort = portFrom.label && labelsObj[portFrom.label]
  if(labelPort) return labelPort

  // Pull the port from an exposed port on the container
  const privatePort = portFrom.port && get(containerObj, `Ports.${portFrom.port}`)
  if(privatePort) return privatePort

  // Pull the port from a path on the inspect container object
  const inspectPort = portFrom.inspect && get(containerObj, portFrom.inspect)
  if(inspectPort) return inspectPort
}

/**
 * Finds the IP Address for the route based on the containerObj, and config
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 * @param {Object} config - Global keg-proxy config
 *
 * @returns {string|number} - Found port or null
 */
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
 * @public
 * @param {Object} containerObj - Meta data of a running container
 *
 * @returns {Promise<route>} - Route object with port, name, and address properties
 */
const buildRoute = async (containerObj, config) => {
  const name = resolveName(containerObj, config)
  const address = resolveIP(containerObj, config)
  const port = await resolvePort(containerObj, config)

  return {
    port: port,
    name: name,
    address: address,
  }
}

/**
 * Validates a route has all required properties
 * @function
 * @public
 * @param {string} name - Name of the container
 * @param {Object} route - Built route object to validate
 * @param {Object} invalid - Group of previously invalid routes
 *
 * @returns {Boolean} - True if the route is valid
 */
const isValidRoute = (name=`Container`, route, invalid) => {
  const missing = !route
    ? `Route`
    : !route.address
      ? `IP Address`
      : !route.port
        ? `Port`
        : false

  // If it's a valid route, then missing is false, so return true
  if(!missing) return true
  // If the container was already marked as invalid just return false
  if(invalid[name]) return false

  logInvalidRoute(name, missing)
  invalid[name] = true

  return false
}


module.exports = {
  buildRoute,
  getContainers,
  isValidRoute,
  formatName,
  limboify,
  resolveIP,
  resolveName,
  resolvePort,
}