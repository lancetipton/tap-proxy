const { getApp } = require('PRApp')
const { config } = require('PRConfig')
const { eitherArr } = require('@keg-hub/jsutils')
const { validateOrigin } = require('./validateOrigin')


const onInvalidOrigin = (req, res, origin) => {
  console.error(`[Tap-Proxy] Invalid Orgin Attempt - ${origin}`)

  return res.status(401).send('NOT AUTHORIZED')
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

  app.use((req, res, next) => {
    
    const foundOrigin = validateOrigin(req, config.origins)
    if(!foundOrigin) return onInvalidOrigin(req, res, origin)

    res.setHeader('Access-Control-Allow-Origin', foundOrigin)
    res.setHeader('Vary', 'Origin,Access-Control-Request-Headers')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS'
    )
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept,Authorization,AuthToken'
    )

    return req.method === 'OPTIONS' ? res.status(200).send('OK') : next()

  })

}

module.exports = {
  setupCors
}


