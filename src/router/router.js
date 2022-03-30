const express = require('express')
const { getApp } = require('PRApp')
const { logRequest } = require('PRUtils/logger')

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
const setupRouter = () => {
  const app = getApp()

  app.disable('x-powered-by')

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