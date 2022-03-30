const fs = require('fs')
const http = require('http')
const https = require('https')
const { getApp } = require('PRApp')
const { Logger } = require('PRUtils/logger')

/**
 * Sets up an insecure server, typically used for local development
 * @param {Object} app - Express app object
 *
 * @retruns {Object} - Insecure server object and Express app object
 */
const insecure = (app) => {
  const { port=80, host=`localhost` } = app.locals.config

  const insecureServer = app.listen(port, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })
  
  return { insecureServer, app }
}

/**
 * Sets up a secure server, typically used for local development
 * @param {Object} app - Express app object
 *
 * @retruns {Object} - Insecure / Secure server object and Express app object
 */
const secure = (app) => {
  const { port=80, host=`localhost` } = app.locals.config
  const creds = {
    key: process.env.KEG_PROXY_PRIVATE_KEY,
    cert: process.env.KEG_PROXY_CERT,
    ca: process.env.KEG_PROXY_CA,
  }
  const credentials = Object.entries(creds).reduce((conf, [key, loc]) => {
    conf[key] = fs.readFileSync(loc, 'utf8')

    return conf
  }, {})

  const httpServer = http.createServer(app)
  const httpsServer = https.createServer(credentials, app)

  const insecureServer = httpServer.listen(port, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Server running on: `, `http://${host}:${port}`)
    Logger.empty()
  })

  const secureServer = httpsServer.listen(443, () => {
    Logger.empty()
    Logger.pair(`[Tap-Proxy] Server running on: `, `http://${host}:443`)
    Logger.empty()
  })

  return { insecureServer, secureServer, app }
}


/**
 * Sets up a server based on config settins
 *
 * @retruns {Object} - Response from server setup method
 */
const setupServer = () => {
  const app = getApp()
  return !app.locals.config.ssl ? insecure(app) : secure(app)
}

module.exports = {
  setupServer
}