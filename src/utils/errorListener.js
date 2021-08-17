const { logError } = require('./logger')

const errorListener = app => {
  app.on('error', exc => logError(exc))
  app.on('uncaughtException', exc => logError(exc))
}

module.exports = {
  errorListener
}