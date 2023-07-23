import querystring from 'node:querystring'
import { envs } from '../../../../helpers/env/index.mjs'

export function url({ path, query }) {

    const { GITHUB_API_URL } = envs('GITHUB_API_URL')

    const qs = query
        ? `?${querystring.stringify(query)}`
        : ''

    const url = `${GITHUB_API_URL}${path}${qs}`

    return url

}

export function headers() {

    const headers = {}

    const { GITHUB_API_AUTHZ } = envs('GITHUB_API_AUTHZ')

    headers['authorization'] =  GITHUB_API_AUTHZ
    headers['Content-Type'] = 'application/json'
    headers['Accept'] = 'application/vnd.github+json'
    headers['X-GitHub-Api-Version'] = '2022-11-28'

    return headers
    
}