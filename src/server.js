const { getApp } = require('PRApp')
const { setupRouter } = require('PRRouter')
const { setupEndpoints } = require('PREndpoints')
const { setupCors } = require('PRMiddleware/setupCors')
const { errorListener } = require('PRUtils/errorListener')
const { setupServer } = require('PRMiddleware/setupServer')
const { setupBlacklist } = require('PRMiddleware/setupBlacklist')

/**
 * Initializes the Tap-Proxy Server and starts listening on the port defined in the config
 * @function
 *
 * @returns {Object} - Express server object
 */
const initProxy = async () => {
  getApp()
  setupCors()
  setupRouter()
  setupBlacklist()
  errorListener()
  setupEndpoints()

  return setupServer()
}


module.exports = {
  initProxy
}
