require('dotenv').config()
require('../../configs/aliases.config').registerAliases()
const { initProxy } = require('./server')

!module.parent
  ? initProxy()
  : (module.exports = () => { initProxy() })
