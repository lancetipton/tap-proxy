const {
  KEG_PROXY_UPDATE=10000,
  KEG_PROXY_HOST=`localhost`,
  KEG_PROXY_SERVER_PORT=80,
  KEG_PROXY_ALLOWED_ORIGINS,
} = process.env

const config = {
  host: KEG_PROXY_HOST,
  port: KEG_PROXY_SERVER_PORT,
  updateInterval: KEG_PROXY_UPDATE,
  origins: KEG_PROXY_ALLOWED_ORIGINS.split(','),
  proxy: {},
  container: {
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