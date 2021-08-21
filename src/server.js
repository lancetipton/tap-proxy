const url = require('url')
const http = require('http')
const { getApp } = require('PRApp')
const { config } = require('PRConfig')
const { setupRouter } = require('PRRouter')
const { Logger } = require('PRUtils/logger')
const { setupEndpoints } = require('PREndpoints')
const { setupCors } = require('PRUtils/setupCors')
const { errorListener } = require('PRUtils/errorListener')

/**
 * Initializes the Keg-Proxy Server and starts listening on the port defined in the config
 * @function
 *
 * @returns {Object} - Express server object
 */
const initProxy = async () => {
  const app = getApp()

  setupCors()
  setupRouter()
  errorListener()
  setupEndpoints()

  const { port=80, host=`localhost` } = app.locals.config
  const server = app.listen(port, () => {
    Logger.empty()
    Logger.pair(`[Keg-Proxy] Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })

  process.on('SIGTERM', () => {
    Logger.info('[Keg-Proxy] Shutting down server...')
    server.close(() => Logger.info('[Keg-Proxy] server shutdown'))
  })

  return server

}

module.exports = {
  initProxy
}
