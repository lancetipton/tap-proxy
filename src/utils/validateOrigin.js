
const { config } = require('PRConfig')
const { RouteTable } = require('PRRouteTable')


/**
 * Resolves the origin from the passed in headers
 * @param {Object} req - Express request object
 */
const getOrigin = req => {
  return (
    req.headers.origin ||
    (req.headers.referer && new URL(req.headers.referer).origin) ||
    (req.headers.host &&
      req.protocol &&
      `${req.protocol}://${req.headers.host.split(':').shift()}`)
  )
}

/**
 * Removes the protocol from the passed in url
 * @param {string} url - Url to have the protocol removed
 * 
 * @returns {string} - Url with the protocol removed
 */
const removeProtocol = url => {
  return !url ? `` : url.includes(`://`) ? url.split(`://`).pop() : url
}

/**
 * Checks if any routes match the request origin
 * @param {string} origin - Origin of the request
 * 
 * @returns {boolean} - True if the origin matches an existing route
 */
const checkRoutesMatch = (origin) => {
  return Object.values(RouteTable.getRoutes()).map(route => removeProtocol(route.url))
  .filter(url => url === removeProtocol(origin))
}

/**
 * Validates that the request origin is an allowed origin
 * @param {Object} req - Express request object
 * @param {Array} allowedOrigins - Origins allowed to access the server
 *
 * @returns {Object} - Contains the origin, and valid: true if the origin is allowed
 */
const validateOrigin = (req, allowedOrigins) => {
  const origin = getOrigin(req)
  const routMatch = checkRoutesMatch(origin)
  return routMatch
    ? { origin, valid: true }
    : allowedOrigins.includes(origin) ? { origin, valid: true } : { origin, valid: false }
}

module.exports = {
  validateOrigin
}