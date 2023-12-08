import { startCli } from './cli-start'
import { handleError } from './error'

startCli().catch(handleError)