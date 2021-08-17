const { config } = require('PRConfig')


class RouteTable {

  routes = {}

  constructor(conf){
    this.config = conf
    this.pollTable()
    // update routing table every 10 seconds
    setInterval(this.pollTable, this.config.updateInterval || 10000) 
  }

  getRoutes = () => {
    return this.routes
  }
  
  pollTable = () => {
    docker.listContainers((err, containers) => {
      containers.forEach((containerInfo) => {
        // TODO: update to parse out the subdomain and prot
        const name = containerInfo.Names[0].substring(1)
        const port = containerInfo.Ports[0].PrivatePort
        
        const container = docker.getContainer(containerInfo.Id)
        container.inspect((err, data)=> {
          // TODO: update to parse out the correct ip address
          const address = data.NetworkSettings.IPAddress

          ;(typeof this.routes[name] === 'undefined') &&
            Logger.info('Adding new route:', name)
          
          ;(this.routes[name].address !== address || this.routes[name].port !== port) &&
            Logger.info('Updating route:', name)

          this.routes[name] = {
            name: name,
            address: address,
            port: port
          }

        })
      })
    })
  }

}

const RT = new RouteTable(config)

module.exports = {
  RouteTable: RT
}