import { load, sync } from "../../../helpers/res/index.mjs"


export async function execute({ resource }) {

    const array = await load({ resource })

    const result = {
        resource: await sync({ array, resource }) 
    }

    return result

}