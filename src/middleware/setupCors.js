const cors = require('cors')
const { getApp } = require('PRApp')
const { config } = require('PRConfig')
const { validateOrigin } = require('../utils/validateOrigin')

/**
 * Config object for setting up CORs
 * @type {Object}
 */
const corsConfig = {
  optionsSuccessStatus: 200,
  origin: (origin, callback) => {
    const { origin, valid } = validateOrigin({headers: { origin }}, config.origins)
    !valid || !origin
      ? callback(new Error('NOT AUTHORIZED'))
      : callback(null, true)
  },
}

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

  app.options('*', cors(corsConfig))
  app.use(cors(corsConfig))

}

module.exports = {
  setupCors
}


