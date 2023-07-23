import { args } from '../../helpers/cli/index.mjs'
import { helper } from '../../helpers/eval/index.mjs'
import { log } from '../../helpers/log/index.mjs'
import { retrieve } from '../../helpers/res/index.mjs'
import { execute } from './resources/index.mjs'


export async function run() {

    log({ level:'info', message: `synching airbyte resources` })

    await execute({ resource: 'source' })
    await execute({ resource: 'destination' })
    await execute({ resource: 'connection' })

    log({ level:'info', message: `airbyte resources was synched successfully` })
    
}

export function config() {

    const { plugin, api } = args('plugin', 'api')
    
    const workspace = 'workspace'
    helper({ 
        name: workspace, 
        method: async function (key) {
            const result = await retrieve({ plugin, api, resource: workspace, key })
            return result
        }
    })

    const source = 'source'
    helper({ 
        name: source, 
        method: async function (key) {
            const result = await retrieve({ plugin, api, resource: source, key })
            return result
        }
    })

    const destination = 'destination'
    helper({ 
        name: destination, 
        method: async function (key) {
            const result = await retrieve({ plugin, api, resource: destination, key })
            return result
        }
    })

    const connection = 'connection'
    helper({ 
        name: connection, 
        method: async function (key) {
            const result = await retrieve({ plugin, api, resource: connection, key })
            return result
        }
    })

}