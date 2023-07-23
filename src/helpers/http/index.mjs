import fetch from "node-fetch"
import { debugging, log } from "../log/index.mjs"

export async function http({ request }) {

    const response = await fetch(request.url, request.info)

    const status = response.status
    
    if (status >= 200 && status < 300) {
        
        if(debugging()) {  
            log({ level: 'debug', message: 'request success', response: { status } })
            log({ level: 'debug', message: 'detailing request', ...request })
        }
        
        return response
    }

    const text = await response.text()

    log({ level: 'error', message: 'request error', response: { status, text } })
    if(debugging()) {  
        log({ level: 'error', message: 'detailing request', ...request })
    }

    const error = new Error('sent request error')
    error.status = status

    throw error

}