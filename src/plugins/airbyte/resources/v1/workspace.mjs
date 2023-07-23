import { http } from "../../../../helpers/http/index.mjs"
import { headers, url } from "./index.mjs"

export function key({ data }) {
    return data.workspaceId
}

export async function id({ key: name }) {
    const data = { name }
    const result = await get({ data })
    if (result) {
        return key({ data: result })
    }
    return undefined
}

const memo = {}
export async function get({ data }) {

    if (!('name' in data) && !('workspaceId' in data)) {
        return undefined
    }

    if ('workspaceId' in data) {

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
                    path: `/v1/workspaces/${key({ data })}`
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

    const response1 = await http({
        request: {
            info: { method: 'GET', headers: headers() },
            url: url({
                path: '/v1/workspaces/',
                query: {
                    includeDeleted: false,
                    limit: 100,
                    offset: 0
                }
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
                path: `/v1/workspaces/${key({ data: found[0] })}`
            })
        }
    })

    const result = await response2.json()

    memo[data.name] = result

    return memo[data.name]

}