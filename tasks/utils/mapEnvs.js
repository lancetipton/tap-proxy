const { exists, noOpObj } = require('@keg-hub/jsutils')

/**
 * Maps the passed in envs to the current process
 * Allows passing a matching key-value alternate map to define the value of the eevs
 * @param {Object} envs - Envs to add to the current process
 * @param {Object} altVals - Altrnate values to use when mapping the envs
 *
 * @returns {Object} - The mapped envs
 */
const mapEnvs = (envs, altVals) => {
  if(!envs) return noOpObj 

  const mapped = Object.entries(envs)
    .reduce((mapped, [ key, value ]) => {
      altVals
        ? exists(altVals[value]) &&
          !exists(process.env[key]) &&
          (mapped[key] = altVals[value])
        : exists(value) &&
          !exists(process.env[key]) &&
          (mapped[key] = value)

      return mapped
    }, {})

  // Add the mapped envs to the current process
  Object.assign(process.env, mapped)

  return mapped
}


module.exports = {
  mapEnvs
}