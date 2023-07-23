import { http } from "../../../../helpers/http/index.mjs"
import { url, headers } from "./index.mjs"

export function key({ data }) {
    return data.username
}

export async function id({ key: username }) {
    const data = { username }
    const result = await get({ data })
    if (result) {
        return key({ data: result })
    }
    return undefined
}

export async function get({ data }) {

    const response = await http({
        request: {
            url: url({ path: '/api/v1/users', query: { limit: 1000000 } }),
            info: { method: 'GET', headers: headers() }    
        }
    })

    const list = await response.json()

    if (list.total_entries <= 0) {
        return undefined
    }

    const result = list.users
        .filter(user => key({ data: user }) === key({ data }))

    if (result.length > 0) {
        return result[0]

    }

    return undefined

}

export async function add({ data }) {

    const response = await http({
        request: {
            url: url({ path: '/api/v1/users' }),
            info: { method: 'POST', headers: headers(), body: JSON.stringify(data) }    
        }
    })

    const result = await response.json()

    return result

}


export async function put({ data }) {

    const response = await http({
        request: {
            url: url({ path: `/api/v1/users/${ key({ data }) }` }),
            info: { method: 'PATCH', headers: headers(), body: JSON.stringify(data) }    
        }
    })
    
    const result = await response.json()

    return result

}

export async function del({ data }) {

    const response = await http({
        request: {
            url: url({ path: `/api/v1/users/${ key({ data }) }` }),
            info: { method: 'DELETE', headers: headers() }    
        }
    })
    
    return data

}