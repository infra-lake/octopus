export function log({ level = 'info', message, ...rest }) {
    
    const values = Object.keys(rest).length
        ? Object
            .keys(rest)
            .filter(key => rest[key])
            .map(key => { 
                const object = {}
                object[key] = rest[key]
                return object
            })
        : []

    console[level](`${level}:`, message, ...values)

}

export function debugging() {
    return process.env.LOG_MODE === 'debug'
}