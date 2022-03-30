const proxy = require('./proxy')
const health = require('./health')
const routes = require('./routes')
const dashboard = require('./dashboard')
const express = require('express')

const middleware = [express.json(), express.urlencoded({ extended: true })]

/**
 * Sets up all endpoints for the tap-proxy
 * IMPORTANT - Always add proxy AFTER all other endpoints
 * @function
 * @public
 *
 */
const setupEndpoints = (...args) => {
  routes(middleware, ...args)
  health(middleware, ...args)
  dashboard(middleware, ...args)
  proxy(...args)
}

module.exports = {
  setupEndpoints
}