const express = require('express')
const bodyParser = require('body-parser')
const { Logger, logRequest } = require('PRUtils/logger')

/**
 * AppRouter - Express router
 * @type {Object}
 * @public
 */
const AppRouter = express.Router()

/**
 * setupRouter - Adds the App router to the passed in express app
 * @type {function}
 * @public
 *
 */
const setupRouter = app => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use((req, res, next) => {
    logRequest(req)
    next()
  })
  app.use(AppRouter)
}

module.exports = {
  AppRouter,
  setupRouter
}