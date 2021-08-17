const { Logger } = require('@keg-hub/cli-utils')
const { setupCors } = require('PRUtils/setupCors')

const errorLogger = app => {
  app.on('error', exc => Logger.error(exc))
  app.on('uncaughtException', exc => Logger.error(exc))
}

module.exports = {
  errorLogger
}