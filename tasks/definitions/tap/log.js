const { docker } = require('@keg-hub/cli-utils')
/**
 * Starts logging the tap-proxy container
 * @param {Object} args - arguments passed from the runTask method
 * @param {string} args.command - Root task name
 * @param {Object} args.tasks - All registered tasks of the CLI
 * @param {string} args.task - Task Definition of the task being run
 * @param {Array} args.options - arguments passed from the command line
 * @param {Object} args.globalConfig - Global config object for the keg-cli
 * @param {string} args.params - Passed in options, converted into an object
 *
 * @returns {void}
 */
const logTap = async (args) => {
  const { params: { follow } } = args
  const cmd = [`logs`, `tap-proxy`]
  follow && cmd.push(`-f`)

  await docker(cmd.join(' '))
}

module.exports = {
  log: {
    name: 'log',
    alias: [`logs`, `lg`],
    action: logTap,
    example: 'proxy log',
    mergeOptions: true,
    description : 'Starts Tap-Proxy docker container',
    options: {
      follow: {
        alias: ['fl'],
        description: `Follow the logs as they are printed`,
        example: `proxy log --no-pull`,
        default: true,
      },
    }
  }
}
