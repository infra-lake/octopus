import { debugging, log } from "../log/index.mjs"

export async function sleep({ milliseconds }) {
    if (debugging()) {
        log({ level: 'debug', message: 'sleeping', milliseconds })
    }
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}