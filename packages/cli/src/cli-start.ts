import process from 'node:process'
import { cac } from 'cac'
import { version } from '../package.json'
import { upload } from './index'
export async function startCli(argv = process.argv) {
  const cli = cac('un')

  cli
    .command('deploy', 'Deploy app')
    // 项目地址 projectPath
    .option('-p, --path <path>', 'Project path', {
      default: '/',
    })
    .action(async (options) => {
      console.log('##### deploy ', options)
      await upload({
        projectPath: options.path as string
      })
    })

  cli.help()
  cli.version(version)
  // Parse CLI args without running the command to
  cli.parse(argv, {run: false})
  
  // handle command errors globally
  await cli.runMatchedCommand()
}