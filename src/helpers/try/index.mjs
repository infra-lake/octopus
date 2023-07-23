import { log } from "../log/index.mjs";
import { sleep } from "../thread/index.mjs";

export async function run({ action, attempts, milliseconds }) {

    let again = false
    let attempt = 0

    do {
        
        try {
            
            return await action()

        } catch (error) {

            again =
                error.status &&
                error.status >= 400 && 
                error.status < 500 && 
                error.status != 408
                    ? false
                    : ++attempt < attempts
            
            if (!again) { throw error }
            
            log({ level:'error', message: error.message, again })

            sleep({ milliseconds })

        }
        
    } while (again)
    

}