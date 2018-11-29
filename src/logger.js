import { prefix } from './config'

let logCounter = 0
let errorCounter = 0
let fatalCounter = 0
let warnCounter = 0

/**
 * Simple function to check if an object is undefined. Returns an empty String if the
 * object is undefined or the object itself if not
 * @param {Object} object  - Your log object
 * @return {Object|String}
 */
const getLogObject = (object) => (
  object !== undefined ? object : ''
)

/**
 * Add counter and prefix and execute simple console.log()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it's will be put together
 * @return {Function}
 */
export const log = (message, _object) => {
  logCounter++

  return console.log(`${logCounter} [LOG|${prefix}] ${message}`, getLogObject(_object))
}

/**
 * Add counter and prefix and execute console.error()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it will be put together
 * @return {Function}
 */
export const error = (message, _object) => {
  errorCounter++

  return console.error(`${errorCounter} [ERROR|${prefix}] ${message}`, getLogObject(_object))
}

/**
 * Add counter and prefix and create a throw new Error()
 * @param  {String} message - Your log text
 * @return {Function}
 */
export const fatal = (message) => {
  fatalCounter++

  throw new Error(`${fatalCounter} [FATAL|${prefix}] ${message}`)
}

/**
 * Add counter and prefix and execute console.warn()
 * @param  {String} message - Your log text
 * @param  {Object} _object - If you pass an object or array, it will be put together
 * @return {Function}
 */
export const warn = (message, _object) => {
  warnCounter++

  return console.warn(`${warnCounter} [WARN|${prefix}] ${message}`, getLogObject(_object))
}
