const { Logger } = require('@keg-hub/cli-utils')

const logError = (...args) => {
  Logger.error(...args)
}


module.exports = {
  logError,
  Logger
}