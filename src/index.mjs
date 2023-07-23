import './helpers/env/index.mjs'
import { args } from './helpers/cli/index.mjs'
import { log, debugging } from './helpers/log/index.mjs'

process.on('SIGILL', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))

try {

    const { plugin } = args('plugin')

    log({ message: `starting octagon`, args: args() })

    const { config, run } = await import(`./plugins/${plugin}/index.mjs`)

    await config()
    
    log({ message: `octagon started successfully` })
    log({ message: `running octagon` })

    await run()

    log({ message: `octagon is finished successfully` })

} catch (error) {

    log({ level:'error', message: 'error at sync', error })

    if (debugging()) { throw error }

}
