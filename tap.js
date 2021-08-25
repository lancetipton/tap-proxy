module.exports = {
  name: 'tap-proxy',
  displayName: 'Tap Proxy',
  keg: {
    cli: {
      link: {
        name: 'proxy'
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