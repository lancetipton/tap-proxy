const status = require('./status')
const rootProxy = require('./rootProxy')
const healthCheck = require('./healthCheck')

/**
 * Sets up all endpoints for the keg-proxy
 * IMPORTANT - Always add rootProxy AFTER all other endpoints
 * @function
 * @public
 *
 */
const setupEndpoints = (...args) => {
  status(...args)
  healthCheck(...args)
  rootProxy(...args)
}

module.exports = {
  setupEndpoints
}