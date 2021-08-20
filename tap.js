module.exports = {
  name: 'keg-node-proxy',
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