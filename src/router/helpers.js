const Docker = require('dockerode')
const { PORT_FROM_KEYS } = require('PRConstants')
const { logInvalidRoute, logError } = require('PRUtils/logger')
const { limbo, get, noOpObj, noPropArr, eitherArr, isStr } = require('@keg-hub/jsutils')

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
  // May want to add the tag from the image. Will need to investigate
  // const nameFromImg = containerObj.Image.split('/').pop().replace(':', '-')
  const name = formatName(containerObj)
  const namePrefix = get(config, 'container.namePrefix', noPropArr)

  return eitherArr(namePrefix, [namePrefix])
    .reduce((cleanedName, item) => {
      return isStr(item)
        ? cleanedName.replace(new RegExp(item), '')
        : cleanedName
    }, name)
}

const containerEnvToObj = (containerEnv) => {
  return containerEnv.reduce((containerObj, item) => {
    const [key, val] = item.split('=')
    val && (containerObj[key] = val)

    return containerObj
  }, {})
}

/**
 * Loops over the possible port location from the PORT_FROM_KEYS constant
 * Checks the proxy.config for any matching ports. First found is returned
 * Order checked is - env | labels | container.port | inspect path ( dot notation ) 
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 *
 * @returns {string} - Formatted name of the container
 */
const resolvePortFrom = (config, data) => {
  // Get the config for finding the port
  const portFrom = get(config, 'container.portFrom', noOpObj)

  // Pull the port from a container ENV
  return Object.entries(PORT_FROM_KEYS)
    .reduce((found, [type, loc]) => {
      if(found || !portFrom[type]) return found

      const fromType = portFrom[type]
      const rootLoc = get(data, loc)
      
      // Envs need to be converted into an object
      // The inspect object returns them as an array as `key=value`
      const potentialVals = type === 'env'
        ? containerEnvToObj(rootLoc)
        : rootLoc

      // Try to use dot notation to resolve the port
      // If that fails try direct reference
      // Labels have . in them, so we use direct reference as a fallback
      const portVal = eitherArr(fromType, [fromType])
        .reduce((foundVal, item) => {
          return foundVal || get(potentialVals, item, potentialVals[item])
        }, false)

      return portVal || found
    }, false)
}

/**
 * Finds the port for the route based on the containerObj, and config
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 * @param {Object} config - Global tap-proxy config
 *
 * @returns {string|number} - Found port or null
 */
const resolvePort = async (containerObj, config) => {
  // Check the container ENVs
  const container = docker.getContainer(containerObj.Id)
  const [insErr, inspectObj] = await limboify(container.inspect.bind(container))
  if(insErr) return console.error(insErr)

  return resolvePortFrom(config, {
    inspectObj,
    containerObj
  })

}

/**
 * Finds the IP Address for the route based on the containerObj, and config
 * @function
 * @public
 * @param {Object} containerObj - JSON object instance of a container returned from dockerode
 * @param {Object} config - Global tap-proxy config
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
    url: `http://${name}.${config.host}`,
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