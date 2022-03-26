
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

const removeProtocol = url => {
  return !url ? `` : url.includes(`://`) ? url.split(`://`).pop() : url
}


const checkRoutesMatch = (origin) => {
  return Object.values(RouteTable.getRoutes()).map(route => removeProtocol(route.url))
  .filter(url => url === removeProtocol(origin))
}


const validateOrigin = (req, allowedOrigins) => {
  const origin = getOrigin(req)
  const routMatch = checkRoutesMatch(origin)
  return routMatch
    ? origin
    : allowedOrigins.includes(origin) ? origin : undefined
}

module.exports = {
  validateOrigin
}