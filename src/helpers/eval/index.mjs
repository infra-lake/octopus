import { readFileSync } from 'fs'
import Handlebars from 'handlebars'
import yaml from 'js-yaml'
import YAML from 'yaml'
import promisedHandlebars from 'promised-handlebars'
import { args } from '../cli/index.mjs'
import { http } from '../http/index.mjs'
import { debugging, log } from '../log/index.mjs'
import { retrieve } from '../res/index.mjs'

const PromisedHandlebars = promisedHandlebars(Handlebars, { Promise })

PromisedHandlebars.registerHelper('http_get', async function (url, authz) {

    const headers = {
        'Accept': 'application/json'
    }

    if (typeof authz === 'string') {
        headers['Authorization'] = authz
    }
    console.log({ url, headers })
    const response = await http({
        request: {
            url,
            info: { method: 'GET', headers }
        }
    })

    const result = await response.json()
    
    return result

})

PromisedHandlebars.registerHelper('file', function (path, type = 'string', level = 0) {

    let data = undefined

    try {
        data = readFileSync(path, { encoding: 'utf-8' })
    } catch (error) {
        if (debugging()) {
            log({ level: 'error', message: `error when try to get file "${path}"`, error })
        }
        throw new Error(`does not found path "${path}"`)
    }

    const _type =
        typeof type !== 'string'
            ? 'string'
            : type

    const _level =
        typeof level !== 'number'
            ? 0
            : level


    if (_type === 'string') {
        const result = data.replace(/(\r\n|\n|\r)/gm, "").replace(/\"/gm, "\\\"")
        return new Handlebars.SafeString(result)
    }

    if (_type === 'yaml' || _type === 'json') {

        if (format === 'yaml') {

            const _yaml = _type === 'yaml' ? data : YAML.stringify(JSON.parse(data))

            const indent = Array.from(Array(_level + 1).keys()).map(() => '  ').reduce((tabs, tab) => `${tabs}${tab}`, '')

            const result = `\n${_yaml.split('\n').map(row => `${indent}${row}`).reduce((content, row) => content ? `${content}\n${row}` : row)}`
            
            return result

        }

        if (format === 'json') {
            const json = _type === 'json' ? data : JSON.stringify(YAML.parse(data))
            return json
        }

    }

    throw new Error(`does not support type "${_type}", it must be "string", "yaml" or "json"`)

})

PromisedHandlebars.registerHelper('id', async function (plugin, api, resource, key, filters) {

    if (filters) {
        filters = JSON.parse(filters)
    }

    let result = await retrieve({ plugin, api, resource, key, filters })

    return result

})

export function helper({ name, method }) {
    PromisedHandlebars.registerHelper(name, method)
}

let format = ''
export async function evaluate({ data }) {

    format = args('format').format

    const template = PromisedHandlebars.compile(data, { noEscape: true })

    const result = await template({ env: process.env })

    switch (format) {
        case 'json': return JSON.parse(result)
        case 'yaml': return yaml.loadAll(result)
        default: throw new Error(`format ${format} was not implemented yet`)
    }

}




