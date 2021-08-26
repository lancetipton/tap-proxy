const {
  KEG_PROXY_UPDATE=10000,
  KEG_PROXY_HOST=`localhost`,
  KEG_PROXY_SERVER_PORT=80,
} = process.env

const config = {
  host: KEG_PROXY_HOST,
  port: KEG_PROXY_SERVER_PORT,
  updateInterval: KEG_PROXY_UPDATE,
  proxy: {},
  container: {
    portFrom: {
      env: [`TAP_PROXY_PORT`, `KEG_PROXY_PORT`],
      label: [`com.keg.env.port`],
      port: [`0.PrivatePort`],
      inspect: [`some.path.on.inspect.object`]
    },
    ipFrom: {
      network: true,
      containerId: true,
    },
    namePrefix: [
      `^package-`,
      `^img-`,
    ]
  }
}


module.exports = {
  config
}