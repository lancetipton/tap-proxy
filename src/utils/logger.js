const { isEmpty } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')

/**
 * Logs error message
 * @function
 * @public
 * @param {Array<*>} args - Error data to be logged
 *
 * @returns {Void}
 */
const logError = (...args) => {
  Logger.error(`[Error Keg-Proxy]`, args.shift())
  args.length && Logger.error(...args)
}

/**
 * Logs all incoming request to the proxy server
 * @function
 * @public
 * @param {Object} req - Incoming Express Request object
 *
 * @returns {Void}
 */
const logRequest = req => {
  const host = req.headers.host
  const url = req.originalUrl
  let message = [`[Keg-Proxy] Request: ${host}${url}`]
  !isEmpty(req.query)
    && (message = [...message, `\n  [Query]`, req.query ])

  !isEmpty(req.params)
    && (message = [...message, `\n  [Params]`, req.params])

  Logger.log(...message)
  Logger.empty()
}

/**
 * Logs error message for invalid route information
 * @function
 * @public
 * @param {string} name - Name of the container
 * @param {string} missing - Invalid part of the route
 *
 * @returns {Void}
 */
const logInvalidRoute = (name, missing) => {
  Logger.error([
    `[Error RouteTable]`,
    Logger.colors.white(`Skipping`),
    Logger.colors.cyan(name),
    Logger.colors.white(`\n  -`),
    Logger.colors.red(missing),
    Logger.colors.white(`could not be found`),
    `\n`
  ].join(' '))
}


module.exports = {
  logError,
  Logger,
  logInvalidRoute,
  logRequest,
}