const {
  KEG_PROXY_HOST,
  KEG_PROXY_SERVER_PORT,
  PROXY_DASHBOARD_PORT,
} = process.env

const config = {
  port: KEG_PROXY_SERVER_PORT || 80,
  updateInterval: 10000,
  host: KEG_PROXY_HOST || `0.0.0.0`,
  container: {
    portFrom: {
      env: `KEG_PROXY_PORT`,
      label: `com.keg.env.port`,
      port: `0.PrivatePort`,
      inspect: `some.path.on.inspect.object`
    },
    ipFrom: {
      network: true,
      containerId: true,
    },
    namePrefix: [
      /^package-/,
      /^img-/
    ]
  }
}


module.exports = {
  config
}