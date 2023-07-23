import { log } from '../../helpers/log/index.mjs'
import { execute } from './resources/index.mjs'

export async function run() {

    log({ level:'info', message: `synching badger resources` })

    await execute({ resource: 'source' })
    await execute({ resource: 'target' })

    log({ level:'info', message: `badger resources was synched successfully` })
    
}

export function config() {

}