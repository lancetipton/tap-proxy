const url = require('url')
const proxy = require('proxy-middleware')
const { AppRouter } = require('PRRouter')
const { RouteTable } = require('PRRouteTable')

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
  res.status(404).send(message)
}

/**
 * Proxy request handler, that forwards requests to the passed in subdomain
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next method
 * @param {Object} proxyRoute - Route object that contains the address and port to proxy requests to 
 * 
 * @returns {void}
 */
const respondProxy = (req, res, next, proxyRoute) => {
  const proxyOptions = url.parse('http://localhost/')
  proxyOptions.preserveHost = false
  proxyOptions.cookieRewrite = true
  proxyOptions.via  = true
  
  proxyOptions.hostname = proxyRoute.address
  proxyOptions.port = proxyRoute.port

  proxy(proxyOptions)(req, res, next)
}

/**
 * Global root handler. Any request that reach here, get passed on to a container via the proxy
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next method
 * 
 * @returns {*} - Response from the proxy
 */
const rootProxy = (req, res, next) => {
  try {

    const destination = req.hostname.split('.')[0]
    const proxyRoute = RouteTable.getRoute(destination)

    return proxyRoute
      ? respondProxy(req, res, next, proxyRoute)
      : respond404(res)

  }
  catch(err){
    respond404(res, err.message)
  }
}

/**
 * Sets up a catch all for all requests not picked up by other endpoints
 * @function
 * @public
 */
module.exports = () => {
  AppRouter.get('*', rootProxy)
}