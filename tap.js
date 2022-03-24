module.exports = {
  name: 'tap-proxy',
  alias: 'tp',
  displayName: 'Tap Proxy',
  keg: {
    cli: {
      link: {
        name: 'tp'
      },
    },
    tapResolver: {
      paths: {
        tapSrc: './src',
      },
      aliases: {
        dynamic: {
        },
      }
    },
  }
}