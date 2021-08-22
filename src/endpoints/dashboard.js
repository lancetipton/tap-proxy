const { AppRouter } = require('PRRouter')
const { RouteTable } = require('PRRouteTable')

/**
 * Currently just returns the routes of the routes table
 * In the future we could add a dashboard, similar to traefik
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next method
 * 
 * @returns {*} - Response in JSON of all routes in the RoutesTable 
 */
const proxyDashboard = (req, res) => {
  const routes = RouteTable.getRoutes()
  res.status(200).json(Object.values(routes)) 
}

/**
 * Add the routes endpoint to the app router
 * @function
 * @public
 */
module.exports = () => {
  AppRouter.get('/keg-proxy', proxyDashboard)
}

// Export the dashboard handler after setting the main exports function
// Because we need to import it other files
module.exports.dashboard = proxyDashboard