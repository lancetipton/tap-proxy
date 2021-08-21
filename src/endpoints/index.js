const routes = require('./routes')
const rootProxy = require('./rootProxy')
const health = require('./health')

/**
 * Sets up all endpoints for the keg-proxy
 * IMPORTANT - Always add rootProxy AFTER all other endpoints
 * @function
 * @public
 *
 */
const setupEndpoints = (...args) => {
  routes(...args)
  health(...args)
  rootProxy(...args)
}

module.exports = {
  setupEndpoints
}