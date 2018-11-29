/* eslint-disable */
import * as map from './map'
import * as view from './view'
import * as layers from './layers'
import * as utils from './utils'
import { global, constructors } from './config'

const obj = {
  get map () {
    return global.map
  },
  get view () {
    return global.view
  },
  get constructors () {
    return constructors
  }
}

export default {
  map,
  view,
  layers,
  utils,
  obj
}
