const moduleAlias = require('module-alias')
const { deepFreeze } = require('@keg-hub/jsutils')
const path = require('path')

const rootDir = path.join(__dirname, '../')

// aliases shared by jest and module-alias
const aliases = deepFreeze({
  PRSrc: path.join(rootDir, 'src'),
  PRApp: path.join(rootDir, 'src/app'),
  PRConstants: path.join(rootDir, 'src/constants'),
  PRTasks: path.join(rootDir, 'tasks'),
  PRConfigs: path.join(rootDir, 'configs'),
  PRUtils: path.join(rootDir, 'src/utils'),
  PRRouter: path.join(rootDir, 'src/router/router.js'),
  PREndpoints: path.join(rootDir, 'src/endpoints'),
  PRConfig: path.join(rootDir, 'configs/proxy.config.js'),
  PRRouteTable: path.join(rootDir, 'src/router/routeTable.js'),
})

// Registers module-alias aliases (done programatically so we can reuse the aliases object for jest)
const registerAliases = () => moduleAlias.addAliases(aliases)

/**
 * Jest is not compatible with module-alias b/c it uses its own require function,
 * and it requires some slight changes to the format of each key and value.
 * `jestAliases` can be set as value of any jest config's `moduleNameMapper` property
 */
const jestAliases = deepFreeze(Object.keys(aliases).reduce(
  (aliasMap, key) => {
    const formattedKey = key + '(.*)'
    aliasMap[formattedKey] = aliases[key] + '$1'
    return aliasMap
  },
  {}
))

module.exports = {
  aliases,
  registerAliases,
  jestAliases
}
