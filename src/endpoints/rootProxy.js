const url = require('url')
const proxy = require('proxy-middleware')
const { AppRouter } = require('PRRouter')
const { RouteTable } = require('PRRouteTable')

const respond404 = (res, message='Route not found in RouteTable') => {
  res.status(404).send(message)
}

const respondProxy = (req, res, next, subdomain, config) => {
  const proxyOptions = url.parse('http://localhost/')
  proxyOptions.preserveHost = false
  proxyOptions.cookieRewrite = true
  proxyOptions.via  = true
  
  proxyOptions.hostname = subdomain.address
  proxyOptions.port = subdomain.port

  proxy(proxyOptions)(req, res, next)
}

const rootProxy = (app, config) => (req, res, next) => {
  try {

    const destination = req.hostname.split('.')[0]
    const subdomain = RouteTable.getRoute(destination)

    return subdomain
      ? respondProxy(req, res, next, subdomain, config)
      : respond404(res)

  }
  catch(err){
    respond404(res, err.message)
  }
}

module.exports = (app, config) => {
  AppRouter.get('*', rootProxy(app, config))

  return app
}