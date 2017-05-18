import { prefix } from './config'

let logCounter = 0,
    errorCounter = 0,
    warnCounter = 0

const log = (message, _object) => {
        const object = _object !== undefined
            ? _object
            : ''

        logCounter++

        return console.log(`${logCounter} ${prefix} ${message}`, object)
    },
    error = (message, _object) => {
        const object = _object !== undefined
            ? _object
            : ''

        errorCounter++

        return console.error(`${errorCounter} ${prefix} ${message}`, object)
    },
    warn = (message, _object) => {
        const object = _object !== undefined
            ? _object
            : ''

        warnCounter++

        return console.warn(`${warnCounter} ${prefix} ${message}`, object)
    }

export {
    log,
    error,
    warn
}
