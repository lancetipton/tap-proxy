const { getApp } = require('PRApp')
const { config } = require('PRConfig')
const { get } = require('@keg-hub/jsutils')
const { dashboard } = require('./dashboard')
const { RouteTable } = require('PRRouteTable')
const { Logger } = require('@keg-hub/cli-utils')
const { validateOrigin } = require('PRUtils/validateOrigin')
const { createProxyMiddleware } = require('http-proxy-middleware')

const { host:proxyHost } = config

/**
 * Request Error response handler, called when the route to proxy to can not be found
 * @function
 * @private
 * @param {Object} res - Express response object
 * @param {string} message - Error message to respond with
 * 
 * @returns {void}
 */
const respond404 = (res, message='Route not found in RouteTable') => {
  res && res.status && res.status(404).send(message)
}


/**
 * Resolves the hostname from the req
 * Uses the hostname || headers.host || headers.origin
 * @function
 * @private
 * @param {Object} req - Express request object
 * 
 * @returns {string} - Found hostname
 */
const resolveHostName = req => {
  const host = get(req, 'hostname', get(req, 'headers.host'))
  if(host) return host.split('.')[0]

  const origin = get(req, `headers.origin`)
  if(!origin) return

  const subOrigin = origin.split('.')[0]
  return subOrigin && subOrigin.split('://')[1]
}

/**
 * Called when the proxy request throws an error
 * If the hostname matches the proxyHost, then we re-route to it
 * Otherwise we response with 404
 * @function
 * @private
 * @param {Object} err - Error that was thrown while attempting to proxy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} target - The hostname of the proxy request that failed
 * 
 * @returns {*} - Response in JSON of all routes in the RoutesTable 
 */
const onProxyError = (err, req, res, target) => {
  return proxyHost === req.hostname
    ? dashboard(req, res)
    : respond404(res, err.message)
}

/**
 * Global proxy handler. Any request that reach here, get passed on to a container via the proxy
 * It's not documented anywhere, but if null is returned, the express app router handles the request
 * This allows the `<domain>/tap-proxy/**` routes to work
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next method
 * 
 * @returns {Object} - Contains the port and host ip address to proxy the request to
 */
const proxyRouter = req => {
  const destination = resolveHostName(req)
  if(!destination) return null
  
  // TODO: setup a default route when none is defined
  // Then set herkin as the default
  const route = RouteTable.getRoute(destination) || RouteTable.routes[config.container.defaultRoute]

  if(!route) return null


  const conf = {
    protocol: route.port === 443 ? `https:` : `http:`,
    port: route.port,
    host: route.address
  }
  
  return conf
} 

const addAllowOriginHeader = (proxyRes, origin) => {
  proxyRes.headers['Access-Control-Allow-Origin'] = origin
}

const mapRequestHeaders = (proxyReq, req) => {
  Object.keys(req.headers)
    .forEach(key => proxyReq.setHeader(key, req.headers[key]))
}

/**
 * Maps the response headers from the response to the proxied response
 * @param {Object} proxyRes - Respose object used by the proxy
 * @param {Object} res - Original response object
 *
 * @returns {void}
 */
const mapResponseHeaders = (proxyRes, res) => {
  Object.keys(proxyRes.headers)
    .forEach(key => res.append(key, proxyRes.headers[key]))
}

/**
 * Sets up a catch all for all requests not picked up by other endpoints
 * Currently because of `app.use`, all request are picked up by the proxy no matter what
 * To allow `tap-proxy/**` routes to work, the proxyRouter method returns null when a route can't be found
 * Which then defaults back to using the internal express AppRouter
 * This functionality is not documented anywhere, so it's possible it could change
 * Will need to work out an alternate solution if it does
 * @function
 * @public
 */
module.exports = () => {
  const app = getApp()

  Logger.info(`Allowed Origins: ${config.origins.join(', ')}`)

  app.use(`**`, createProxyMiddleware({
    ws: true,
    xfwd: true,
    logLevel: 'error',
    target: proxyHost,
    changeOrigin: true,
    ...config.proxy,
    router: proxyRouter,
    onError: onProxyError,
    onProxyReq: (proxyReq, req, res) => {
      const {valid} = validateOrigin(req, config.origins)
      if(!valid){
        Logger.error(`Origin ${origin} does not match allowed origins ${config.origins.join(', ')}`)
        res.status(401).send('NOT AUTHORIZED')
        return
      }
      mapRequestHeaders(proxyReq, req)
    },
    onProxyRes: (proxyRes, req, res) => {
      mapResponseHeaders(proxyRes, res)
      const {origin, valid} = validateOrigin(req, config.origins)
      valid
        ? addAllowOriginHeader(proxyRes, origin)
        : Logger.error(`Origin ${origin} does not match allowed origins ${config.origins.join(', ')}`)
    },
  }))

}