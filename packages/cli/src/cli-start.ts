import process from 'node:process'
import { cac } from 'cac'
import { version } from '../package.json'
import { main } from './index'

export async function startCli(argv = process.argv) {
  const cli = cac('un')

  cli
    .command('deploy', 'deploy app')
    .action(async (options) => {
      console.log('##### deploy ', options)
      await main()
    })

  cli.help()
  cli.version(version)
  // Parse CLI args without running the command to
  cli.parse(argv, {run: false})
  
  // handle command errors globally
  await cli.runMatchedCommand()
}