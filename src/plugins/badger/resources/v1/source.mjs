import { http } from "../../../../helpers/http/index.mjs"
import { headers, url } from "./index.mjs"

export function key({ data }) {
    return data.name
}

export async function id({ key: name }) {
    const data = { name }
    const result = await get({ data })
    if (result) {
        return key({ data: result })
    }
    return undefined
}

export async function get({ data }) {

    try {

        const response = await http({
            request: {
                url: url({
                    path: '/source',
                    query: { 'filter[name]': key({ data }) }
                }),
                info: { method: 'GET', headers: headers() }
            }
        })

        const json = await response.json()

        if (json.metadata.count <= 0) {
            return undefined
        }

        return json.results[0]

    } catch (error) {
        if ((error?.status ?? 0) === 404) { return undefined }
        throw error
    }

}

export async function add({ data }) {
    return await save({ data })
}


export async function put({ data }) {
    return await save({ data })
}

async function save({ data }) {

    const response = await http({
        request: {
            url: url({ path: '/source' }),
            info: {
                method: 'POST',
                headers: headers(),
                body: JSON.stringify(data)
            }
        }
    })

    const result = await response.json()

    return result

}

export async function del({ data }) {

    const response = await http({
        request: {
            url: url({
                path: '/export',
                query: { 'filter[source][name]': key({ data }) }
            }),
            info: { method: 'GET', headers: headers() }
        }
    })

    const json = await response.json()

    if (json.metadata.count > 0) {
        await Promise.all(json.results.map(async ({ transaction, source, target }) => {
            await http({
                request: {
                    url: url({
                        path: '/export',
                        query: {
                            transaction,
                            'source[name]': source.name,
                            'target[name]': target.name
                        }
                    }),
                    info: { method: 'DELETE', headers: headers() }
                }
            })
        }))
    }

    await http({
        request: {
            url: url({ path: '/source', query: { name: key({ data }) } }),
            info: { method: 'DELETE', headers: headers() }
        }
    })

    return data

}