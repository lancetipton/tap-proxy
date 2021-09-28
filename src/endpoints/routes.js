const { AppRouter } = require('PRRouter')
const { RouteTable } = require('PRRouteTable')

/**
 * Endpoint to get all active routes
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {*} - Response with status 200, and all proxy routes 
 */
const proxyRoutes = (req, res) => {
  const routes = RouteTable.getRoutes()
  res.status(200).json(Object.values(routes)) 
}

/**
 * Endpoint to reset the RouteTable so it will recheck for container routes
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {*} - Response with status 200, and routes reset message
 */
const proxyReset = (req, res) => {
  RouteTable.resetRoutes()
  res.status(200).json({ status: 200, message: `Routes have been reset.`, }) 
}


/**
 * Add the routes endpoint to the app router
 * @function
 * @public
 */
module.exports = () => {
  AppRouter.get('/tap-proxy/routes', proxyRoutes)
  AppRouter.get('/tap-proxy/reset', proxyReset)
}