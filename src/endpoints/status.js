const { AppRouter } = require('PRRouter')
const { RouteTable } = require('PRRouteTable')

const proxyStatus = (app, config) => (req, res) => {
  const routes = RouteTable.getRoutes()
  res.json(routes) 
}

module.exports = (app, config) => {
  AppRouter.get('/status', proxyStatus(app, config))

  return app
}