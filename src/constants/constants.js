const { deepFreeze } = require('@keg-hub/jsutils')

module.exports = deepFreeze({
  PORT_FROM_KEYS: {
    env: 'inspectObj.Config.Env',
    port: 'containerObj.Ports',
    label: 'containerObj.Labels',
    inspect: 'inspectObj',
  }
})