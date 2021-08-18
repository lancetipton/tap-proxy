const url = require('url')
const http = require('http')
const express = require('express')
const { config } = require('PRConfig')
const { setupRouter } = require('PRRouter')
const { setupEndpoints } = require('PREndpoints')
const { Logger } = require('PRUtils/logger')
const { setupCors } = require('PRUtils/setupCors')
const { errorListener } = require('PRUtils/errorListener')

const app = express()

const initProxy = async () => {
  const app = express()

  setupCors(app)
  setupRouter(app)
  errorListener(app)

  app.listen(config.port, () => {
    Logger.pair('Proxy Server running on ' + config.port)
  })

}

module.exports = {
  initProxy
}
