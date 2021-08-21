module.exports = {
  name: 'keg-proxy',
  displayName: 'Keg Node Proxy',
  keg: {
    cli: {
      link: {
        name: 'kpy'
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