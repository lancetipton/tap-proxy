const { AppRouter } = require('PRRouter')

/**
 * Endpoint to handle health check requests
 * @function
 * @private
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {*} - Response with status 200
 */
const health = (req, res) => {
  res.status(200).send('OK') 
}

/**
 * Add the health check endpoint to the app router
 * @function
 * @public
 */
module.exports = (middleware) => {
  AppRouter.get('/tap-proxy/health', ...middleware, health)
}
