import { http } from "../../../../helpers/http/index.mjs"
import { url, headers } from "./index.mjs"

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

    const response = await http({
        request: {
            url: url({ path: '/api/v1/pools', query: { limit: 1000000 } }),
            info: { method: 'GET', headers: headers() }    
        }
    })

    const list = await response.json()

    if (list.total_entries <= 0) {
        return undefined
    }

    const result = list.pools
        .filter(pool => key({ data: pool }) === key({ data }))

    if (result.length > 0) {
        return result[0]

    }

    return undefined

}

export async function add({ data }) {

    const response = await http({
        request: {
            url: url({ path: '/api/v1/pools' }),
            info: { method: 'POST', headers: headers(), body: JSON.stringify(data) }    
        }
    })

    const result = await response.json()

    return result

}


export async function put({ data }) {

    const response = await http({
        request: {
            url: url({ path: `/api/v1/pools/${ key({ data }) }` }),
            info: { method: 'PATCH', headers: headers(), body: JSON.stringify(data) }    
        }
    })
    
    const result = await response.json()

    return result

}

export async function del({ data }) {

    await http({
        request: {
            url: url({ path: `/api/v1/pools/${ key({ data }) }` }),
            info: { method: 'DELETE', headers: headers() }    
        }
    })
    
    return data

}