import { http } from "../../../../helpers/http/index.mjs"
import { headers, url } from "./index.mjs"
import * as workspace from "./workspace.mjs"

export function key({ data }) {
    return data.connectionId
}

export async function id({ key: name, filters }) {
    const data = { name, ...filters }
    const result = await get({ data })
    if (result) {
        return key({ data: result })
    }
    return undefined
}

const memo = {}
export async function get({ data }) {

    if (!('name' in data) && !('connectionId' in data)) {
        return undefined
    }

    if ('connectionId' in data) {

        const memoized =
            Object
                .keys(memo)
                .filter(name => key({ data: memo[name] }) === key({ data }))
                .map(name => memo[name])

        if (memoized.length > 0) {
            return memoized[0]
        }

        const response = await http({
            request: {
                info: { method: 'GET', headers: headers() },
                url: url({
                    path: `/v1/connections/${key({ data })}`
                })
            }
        })

        const result = await response.json()

        memo[result.name] = result

        return memo[result.name]

    }

    if (data.name in memo && memo[data.name]) {
        return memo[data.name]
    }

    const query = {
        includeDeleted: false,
        limit: 100,
        offset: 0
    }

    if ('workspace' in data && data.workspace) {
        const _workspace = await workspace.get({ data: data.workspace })
        query.workspaceIds = _workspace.workspaceId
    }

    const response1 = await http({
        request: {
            info: { method: 'GET', headers: headers() },
            url: url({
                path: '/v1/connections/',
                query
            })
        }
    })

    const json = await response1.json()

    const found = 'data' in json
        ? json.data.filter(item => item.name === data.name)
        : []

    if (found.length <= 0) {
        return undefined
    }

    const response2 = await http({
        request: {
            info: { method: 'GET', headers: headers() },
            url: url({
                path: `/v1/connections/${key({ data: found[0] })}`
            })
        }
    })

    const result = await response2.json()

    memo[data.name] = result

    return memo[data.name]

}

export async function add({ data }) {

    const request = {
        info: { method: 'POST', headers: headers(), body: JSON.stringify(data) },
        url: url({
            path: '/v1/connections/'
        })
    }

    const response = await http({ request })

    const result = response.json()

    memo[data.name] = result

    return memo[data.name]
}

export async function put({ data }) {

    data.connectionId = await id({
        key: data.name,
        filters: { workspace: { workspaceId: data.workspaceId } }
    })

    const request = {
        info: { method: 'PATCH', headers: headers(), body: JSON.stringify(data) },
        url: url({
            path: `/v1/connections/${key({ data })}`
        })
    }

    const response = await http({ request })

    const result = await response.json()

    memo[data.name] = result

    return memo[data.name]

}

export async function del({ data }) {

    const request = {
        info: { method: 'DELETE', headers: headers() },
        url: url({
            path: `/v1/connections/${key({ data })}`
        })
    }

    await http({ request })

    delete memo[data.name]

}