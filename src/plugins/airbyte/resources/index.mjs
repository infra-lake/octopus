import { args } from '../../../helpers/cli/index.mjs'
import { load, sync } from '../../../helpers/res/index.mjs'
import { run } from '../../../helpers/try/index.mjs'
import { sleep } from '../../../helpers/thread/index.mjs'

export async function execute({ resource }) {

    const { recreate = 'false' } = args('recreate')

    if (recreate === 'true' && resource === 'connection') {
        await sleep({ milliseconds: 60000 })
    }

    const array = await load({ resource })

    const action = async () => {
        return await sync({ array, resource })    
    }

    const attempts = resource === 'connection' ? 20 : 1

    const result = {
        resource: await run({ action, attempts, milliseconds: 30000 })
    }

    await sleep({ milliseconds: 10000 })

    return result

}

