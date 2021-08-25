
/**
 * Starts the tap-proxy tap with docker-compose calling the keg-cli tap start task
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
const startTap = async (args) => {
  !args.params.pull && console.log(`[Keg Proxy] Skipping pull image from provider...`)
  await args.task.cliTask(args)
}

module.exports = {
  start: {
    name: 'start',
    alias: ['str'],
    action: startTap,
    example: 'proxy start',
    // Merge the default task options with these custom task options
    mergeOptions: true,
    description : 'Starts Tap-Proxy docker container',
    options: {
      pull: {
        alias: ['pl'],
        description: `Should pull the docker image`,
        example: `proxy start --pull`,
        default: false,
      },
      recreate: {
        alias: [`create`, `rct`],
        description: `Recreate the docker images before starting`,
        example: 'proxy start --no-recreate',
        default: true,
      }
    }
  }
}
