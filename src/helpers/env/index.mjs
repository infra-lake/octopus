import { config } from 'dotenv'
config()

export function envs(...keys) {

    const entries = key => ({ key, value: process.env[key] })
    const onlyKeys = entry => (keys ?? []).length <= 0 || keys.includes(entry.key)

    const toEnvs = (envs, { key, value }) => {
        envs[key] = value
        return envs
    }

    const result =
        Object.keys(process.env)
            .map(entries)
            .filter(onlyKeys)
            .reduce(toEnvs, {})

    return result

}