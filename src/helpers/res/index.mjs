import fs from 'fs'
import { args } from "../cli/index.mjs"
import { evaluate } from "../eval/index.mjs"
import { log } from "../log/index.mjs"

export async function load({ resource, name }) {
    
    const { format, path } = args('format', 'path')

    const _path = `${path}/${resource}s`

    log({ level:'info', message: `loading ${resource}s`, name, path: _path })

    if (!fs.existsSync(_path)) {
        log({ level:'info', message: `${resource}s not found` })
        return []
    }

    log({ level:'info', message: `${resource}s loaded successfully` })
    log({ level:'info', message: `replacing ${resource}s variables` })

    const resources = await Promise.all(
        fs
            .readdirSync(_path)
            .filter(filename => name ? filename === `${name}.${format}` : true)
            .map(filename => `${_path}/${filename}`)
            .map(file => fs.readFileSync(file, { encoding: 'utf-8' }))
            .map(async data => await evaluate({ data }))
    )

    log({ level:'info', message: `${resource}s variables replaced successfully` })

    return resources

}

export async function sync({ array, resource }) {

    const { plugin, api, recreate = 'false' } = args('plugin', 'api', 'recreate')

    log({ level:'info', message: `synchronizing ${resource}s`})

    const result = await Promise.all(array.map(async data => {

        const { get, add, put, del } = await import(`../../plugins/${plugin}/resources/${api}/${resource}.mjs`)

        const found = await get({ data })
        
        if (found) {
            if (recreate === 'true') {
                await del({ data: found })
            } else {
                if (put) {
                    return await put({ data })
                }
                return data
            }
        }

        return await add({ data })


    }))

    log({ level:'info', message: `${resource}s synchronized successfully` })

    return result

}

export async function retrieve({ plugin, api, resource, key, filters }) {

    const { id } = await import(`../../plugins/${plugin}/resources/${api}/${resource}.mjs`)

    const result = await id({ key, filters })
    if (!result) {
        throw new Error(`does not found id for "${resource}" with key "${key}" using api "${api}", ensure if your "${plugin}" has already registered this "${resource}" key and try again`)
    }

    return result

}