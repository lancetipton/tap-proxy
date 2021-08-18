const { isEmpty } = require('@keg-hub/jsutils')
const { Logger } = require('@keg-hub/cli-utils')

const logError = (...args) => {
  Logger.error(...args)
}

const logRequest = req => {
  const host = req.headers.host
  const url = req.originalUrl
  let message = [`[Request] Host: ${host} | Url: ${url}`]
  !isEmpty(req.query)
    && (message = [...message, `\n  [Query]`, req.query ])

  !isEmpty(req.params)
    && (message = [...message, `\n  [Params]`, req.params])

  Logger.log(...message)
  Logger.empty()
}

module.exports = {
  logError,
  Logger,
  logRequest,
}