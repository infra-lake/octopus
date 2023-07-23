import { log } from '../../helpers/log/index.mjs'
import { execute } from './resources/index.mjs'

export async function run() {

    log({ level:'info', message: `synching airflow resources` })

    await execute({ resource: 'role' })
    await execute({ resource: 'user' })
    await execute({ resource: 'variable' })
    await execute({ resource: 'connection' })
    await execute({ resource: 'pool' })

    log({ level:'info', message: `airflow resources was synched successfully` })
    
}

export function config() {

}