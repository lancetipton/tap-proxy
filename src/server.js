const url = require('url')
const http = require('http')
const express = require('express')
const Docker = require('dockerode')
const { config } = require('PRConfig')
const proxy = require('proxy-middleware')
const { setupRouter } = require('PRRouter')
const { Logger } = require('@keg-hub/cli-utils')
const { setupCors } = require('PRUtils/setupCors')
const { errorLogger } = require('PRUtils/errorLogger')

const app = express()
const docker = new Docker()

const initProxy = async () => {
  const app = express()

  setupCors(app)
  errorLogger(app)
  setupRouter(app)

  app.listen(config.port, () => {
    Logger.pair('Proxy Server running on ' + config.port)
  })

}

module.exports = {
  initProxy
}
