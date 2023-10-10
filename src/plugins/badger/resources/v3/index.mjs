import querystring from 'node:querystring'
import { envs } from '../../../../helpers/env/index.mjs'

export function url({ path, query }) {
    
    const { BADGER_API_URL } = envs('BADGER_API_URL')
    
    const qs = query
        ? `?${querystring.stringify(query)}`
        : ''

    const url = `${BADGER_API_URL}${path}${qs}`

    return url

}

export function headers() {

    const headers = {}

    const { BADGER_API_AUTHZ } = envs('BADGER_API_AUTHZ')

    headers['authorization'] =  BADGER_API_AUTHZ
    headers['Content-Type'] = 'application/json'
    headers['Accept'] = 'application/json'

    return headers
    
}