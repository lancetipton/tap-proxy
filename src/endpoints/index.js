const proxy = require('./proxy')
const health = require('./health')
const routes = require('./routes')

/**
 * Sets up all endpoints for the keg-proxy
 * IMPORTANT - Always add proxy AFTER all other endpoints
 * @function
 * @public
 *
 */
const setupEndpoints = (...args) => {
  routes(...args)
  health(...args)
  proxy(...args)
}

module.exports = {
  setupEndpoints
}