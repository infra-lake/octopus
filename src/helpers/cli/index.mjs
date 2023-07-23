export function args(...keys) {

    const onlyParameters = (_, index) => index > 1

    const entries = value => {
        const split = value.split('=')
        return {
            key: split[0],
            value: split[1]
        }
    }

    const onlyKeys = entry => (keys ?? []).length <= 0 || keys.includes(entry.key)

    const toArgs = (args, { key, value }) => {
        args[key] = value
        return args
    }

    const result =
        process.argv
            .filter(onlyParameters)
            .map(entries)
            .filter(onlyKeys)
            .reduce(toArgs, {})

    return result

}