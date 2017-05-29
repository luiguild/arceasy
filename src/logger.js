import { prefix } from './config'

let logCounter = 0
let errorCounter = 0
let fatalCounter = 0
let warnCounter = 0

/**
 * Add conter and prefix and execute simple console.log()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it's will be put together
 * @return {Function}
 */
const log = (message, _object) => {
    const object = _object !== undefined
        ? _object
        : ''

    logCounter++

    return console.log(`${logCounter} ${prefix} ${message}`, object)
}

/**
 * Add conter and prefix and execute console.error()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it's will be put together
 * @return {Function}
 */
const error = (message, _object) => {
    const object = _object !== undefined
        ? _object
        : ''

    errorCounter++

    return console.error(`${errorCounter} ${prefix} ${message}`, object)
}

/**
 * Add conter and prefix and create a throw new Error()
 * @param  {String} message - Your log text
 * @return {Function}
 */
const fatal = (message) => {
    fatalCounter++

    throw new Error(`${fatalCounter} ${prefix} ${message}`)
}

/**
 * Add conter and prefix and execute console.warn()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it's will be put together
 * @return {Function}
 */
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
