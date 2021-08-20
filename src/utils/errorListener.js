const { getApp } = require('PRApp')
const { logError } = require('./logger')

/**
 * Adds listeners for error events on the express app, and logs them
 * @function
 *
 * @returns {Void}
 */
const errorListener = () => {
  const app = getApp()

  app.on('error', exc => logError(exc))
  app.on('uncaughtException', exc => logError(exc))
}

module.exports = {
  errorListener
}