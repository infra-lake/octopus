import { log } from '../../helpers/log/index.mjs'
import { execute } from './resources/index.mjs'

export async function run() {

    log({ level:'info', message: `synching github resources` })

    log({ level:'info', message: `github resources was synched successfully` })
    
}

export function config() {

}