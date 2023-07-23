import querystring from 'node:querystring'
import { envs } from '../../../../helpers/env/index.mjs'

export function url({ path, query }) {

    const { AIRBYTE_API_URL } = envs('AIRBYTE_API_URL')

    const qs = query
        ? `?${querystring.stringify(query)}`
        : ''

    const url = `${AIRBYTE_API_URL}${path}${qs}`

    return url

}

export function headers() {

    const headers = {}

    const { AIRBYTE_API_AUTHZ } = envs('AIRBYTE_API_AUTHZ')

    headers['authorization'] =  AIRBYTE_API_AUTHZ
    headers['Content-Type'] = 'application/json'
    headers['Accept'] = 'application/json'

    return headers
    
}