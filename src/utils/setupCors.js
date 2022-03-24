const { getApp } = require('PRApp')
const { config } = require('PRConfig')
const { eitherArr } = require('@keg-hub/jsutils')

/**
 * Configures cors for the backend API and websocket
 * Defines the origins that are allow to connect to the API
 * @param {Object} app - Express app object
 * @param {Object} config - Herkin config server property object ( herkinConfig.server )
 *
 * @returns {void}
 */
const setupCors = () => {
  const app = getApp()

  const allowedOrigins = !config.origins
    ? ['*']
    : eitherArr(config.origins, [config.origins])

  app.use((req, res, next) => {
    const origin = req.headers.origin
    const foundOrigin = (allowedOrigins.includes(origin)) ? origin : allowedOrigins[0]

    res.header("Access-Control-Allow-Origin", foundOrigin)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

    next()
  })

}

module.exports = {
  setupCors
}