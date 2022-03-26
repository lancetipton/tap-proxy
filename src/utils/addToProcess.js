const { exists, isStr, isNum } = require('@keg-hub/jsutils')

/**
 * Loop over the passed in ENVs, and add them to the current process
 * Add them to the process.env if they don't already exist or force argument is true
 * @param {Object} addEnvs - Envs to add to the current process
 * @param {Boolean} force - Force add the env, even if it already exists
 *
 * @returns {Void}
 */
const addToProcess = (addEnvs, force) => {
  Object.entries(addEnvs).map(([key, value]) => {
    if (!exists(value) || (exists(process.env[key]) && !force)) return

    process.env[key] = (
      (isStr(value) || isNum(value) ? value : JSON.stringify(value))
    )
  })
}

module.exports = {
  addToProcess
}
