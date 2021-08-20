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
 * @returns {Void}
 */
const initProxy = async () => {
  const app = getApp()

  setupCors()
  setupRouter()
  errorListener()
  setupEndpoints(app, config)

  const server = app.listen(app.locals.config.port, () => {
    Logger.pair('[Keg-Proxy] Server running on port: ', app.locals.config.port)
  })

  process.on('SIGTERM', () => {
    Logger.info('[Keg-Proxy] Shutting down server...')
    server.close(() => Logger.info('[Keg-Proxy] server shutdown'))
  })

}

module.exports = {
  initProxy
}
