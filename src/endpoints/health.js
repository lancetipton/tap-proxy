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
  res.status(200).json({ status: 200, data: 'OK' }) 
}

/**
 * Add the health check endpoint to the app router
 * @function
 * @public
 */
module.exports = () => {
  AppRouter.get('/keg-proxy/health', health)
}
