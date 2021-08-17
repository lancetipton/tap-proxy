const express = require('express')

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
  app.use(AppRouter)
}

module.exports = {
  AppRouter,
  setupRouter
}