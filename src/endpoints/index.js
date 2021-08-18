const rootProxy = require('./rootProxy')
const status = require('./status')

const setupEndpoints = (...args) => {
  status(...args)
  rootProxy(...args)
}

module.exports = {
  setupEndpoints
}