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
 * Add the routes endpoint to the app router
 * @function
 * @public
 */
module.exports = () => {
  AppRouter.get('/keg-proxy/routes', proxyRoutes)
}