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
                    path: '/v3/source',
                    query: { name: key({ data }) }
                }),
                info: { method: 'GET', headers: headers() }
            }
        })

        const json = await response.json()

        if (json.length <= 0) {
            return undefined
        }

        return json[0]

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
            url: url({ path: '/v3/source' }),
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
                path: '/v3/export',
                query: { source: key({ data }) }
            }),
            info: { method: 'GET', headers: headers() }
        }
    })

    const json = await response.json()

    if (json.length > 0) {
        await Promise.all(json.map(async ({ transaction, source, target }) => {
            await http({
                request: {
                    url: url({
                        path: '/v3/export',
                        query: {
                            transaction,
                            source: source.name,
                            target: target.name
                        }
                    }),
                    info: { method: 'DELETE', headers: headers() }
                }
            })
        }))
    }

    await http({
        request: {
            url: url({ path: `/v3/source/${key({ data })}` }),
            info: { method: 'DELETE', headers: headers() }
        }
    })

    return data

}