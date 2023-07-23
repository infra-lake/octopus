import { http } from "../../../../helpers/http/index.mjs"
import { url, headers } from "./index.mjs"

export function key({ data }) {
    return data.id
}

export async function id({ key: keys }) {
    const [ owner, repo, name ] = keys.split('/')
    const data = { owner, repo, name }
    const result = await get({ data })
    if (result) {
        return key({ data: result })
    }
    return undefined
}

export async function get({ data }) {

    const response = await http({
        request: {
            url: url({ path: `/repos/${data.owner}/${data.repo}/actions/workflows`, query: { per_page: 100 } }),
            info: { method: 'GET', headers: headers() }    
        }
    })

    const list = await response.json()

    if (list.total_count <= 0) {
        return undefined
    }
    
    const result = list.workflows
        .filter(workflow => workflow.name.trim() === data.name.trim())
    
    if (result.length > 0) {
        return result[0]

    }

    return undefined

}