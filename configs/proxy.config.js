const { loadConfigs } = require('@keg-hub/parse-config')
const { addToProcess } = require('PRUtils/addToProcess')

addToProcess(
  loadConfigs({
    name: 'proxy',
    env: process.env.NODE_ENV || `staging`,
    locations: [],
  })
)

const generateOrigins = (allowedOrigins) => {
  return (allowedOrigins || 'localhost').split(',')
    .reduce((acc, origin) => {
      const host = (origin || '').trim()
      if(!host || acc.includes(host)) return acc

      const cleaned = host.replace(`https://`, '')
        .replace(`http://`, '')
        .replace(`wss://`, '')
        .replace(`ws://`, '')
      
      !acc.includes(cleaned) &&
        acc.push(
          cleaned,
          `https://${cleaned}`,
          `http://${cleaned}`,
          `wss://${cleaned}`,
          `ws://${cleaned}`
        )

      return acc
    }, [])
}

const {
  KEG_PROXY_UPDATE=10000,
  KEG_PROXY_HOST=`localhost`,
  KEG_PROXY_SERVER_PORT=80,
  KEG_PROXY_DEFAULT_ROUTE,
  KEG_PROXY_ALLOWED_ORIGINS,
} = process.env

const config = {
  host: KEG_PROXY_HOST,
  port: KEG_PROXY_SERVER_PORT,
  updateInterval: KEG_PROXY_UPDATE,
  origins: generateOrigins(KEG_PROXY_ALLOWED_ORIGINS),
  proxy: {},
  ssl: Boolean(process.env.KEG_PROXY_SSL),
  creds: {
    key: process.env.KEG_PROXY_PRIVATE_KEY,
    cert: process.env.KEG_PROXY_CERT,
    ca: process.env.KEG_PROXY_CA,
  },
  container: {
    defaultRoute: KEG_PROXY_DEFAULT_ROUTE,
    portFrom: {
      env: [ `API_PORT`, `TAP_PROXY_PORT`, `KEG_PROXY_PORT`],
      label: [`com.keg.env.port`],
      port: [`0.PrivatePort`],
      // inspect: [`some.path.on.inspect.object`]
    },
    ipFrom: {
      network: true,
      containerId: true,
    },
    namePrefix: [
      `^package-`,
      `^img-`,
      `^keg-`,
    ]
  }
}


module.exports = {
  config
}