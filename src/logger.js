import { prefix } from './config'

let logCounter = 0
let errorCounter = 0
let fatalCounter = 0
let warnCounter = 0

const log = (message, _object) => {
    const object = _object !== undefined
        ? _object
        : ''

    logCounter++

    return console.log(`${logCounter} ${prefix} ${message}`, object)
}

const error = (message, _object) => {
    const object = _object !== undefined
        ? _object
        : ''

    errorCounter++

    return console.error(`${errorCounter} ${prefix} ${message}`, object)
}

const fatal = (message) => {
    fatalCounter++

    throw new Error(`${fatalCounter} ${prefix} ${message}`)
}

const warn = (message, _object) => {
    const object = _object !== undefined
        ? _object
        : ''

    warnCounter++

    return console.warn(`${warnCounter} ${prefix} ${message}`, object)
}

export {
    log,
    error,
    fatal,
    warn
}
