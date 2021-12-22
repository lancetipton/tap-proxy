const path = require('path')

module.exports = {
  paths: {
    repoRoot: path.join(__dirname),
    workDir: 'herkin',
    reportsDir: 'reports',
    artifactsDir: 'artifacts',
    featuresDir: 'bdd/features',
    supportDir: 'bdd/support',
    world: 'bdd/support/world.js',
    stepsDir: 'bdd/steps',
    unitDir: 'unit',
    waypointDir: 'waypoint',
  },
}
