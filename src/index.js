import * as map from './map'
import * as view from './view'
import * as layers from './layers'
import * as utils from './utils'
import { global } from './config'

module.exports = {
    map,
    view,
    layers,
    utils,
    obj: {
        map: global.map,
        view: global.view
    }
}
