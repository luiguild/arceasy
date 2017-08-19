import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Recieve all layers, work and add on map
 * @constructor
 * @param  {Array} layers - List of layers
 * @return {Function} - New Layer on Map
 */
export const add = layers => {
    const map = global.map

    layers.map((layer, indx) => {
        if (validate(layer)) {
            if (layer.id === undefined ||
                layer.id === '' ||
                !layer.id) {
                logger.log(`Adding id by index on layer`)
                layer.id = indx
            }

            layer.outOfRange = true

            return map.add(create(layer))
        }
    })
}

/**
 * Validate single layer
 * @param  {Object} layer - Layer with some options
 * @return {Boolean} True or false to validation
 */
const validate = layer => {
    if (layer) {
        !layer.title ||
            logger.log(`Validating layer: ${layer.title}`)

        if (layer.title === undefined ||
            layer.title === '' ||
            !layer.title) {
            logger.fatal(`You need provide a layer title`)

            return false
        }

        if (layer.visible === undefined ||
            layer.visible === '') {
            layer.visible = true
            logger.warn(`You not set intial visible. Usign default: true`)
        }

        if (layer.definitionExpression === undefined ||
            layer.definitionExpression === '') {
            layer.definitionExpression = ''
            logger.warn(`You not set intial definitionExpression. Usign default: ''`)
        }

        if (layer.type === undefined ||
            layer.type === '' ||
            layer.type === false) {
            logger.fatal(`You need provide a layer type (0 = FeatureLayer, 1 = TileLayer)`)

            return false
        }

        if (layer.url === undefined ||
            layer.url === '' ||
            !layer.url) {
            logger.fatal(`You need provide an URL layer`)

            return false
        }

        return true
    } else {
        logger.fatal(`You need pass some informations to describe your layer`)
        return false
    }
}

/**
 * Recieve a single layer object and return layer ready
 * @param {Object} _layer - Valid Layer object previously worked
 * @return {Object} Layer ready to add on map
 */
const create = _layer => {
    const layerConstructors = constructors.layer
    const utilsConstructors = constructors.utils
    const jsonUtils = utilsConstructors.jsonUtils
    let LayerType
    let layerLabel

    if (_layer.type === 0) {
        layerLabel = 'Feature Layer'
        LayerType = layerConstructors.FeatureLayer
    } else if (_layer.type === 1) {
        layerLabel = 'Tile Layer'
        LayerType = layerConstructors.TileLayer
    }

    const layer = new LayerType({
        id: _layer.id,
        title: _layer.title,
        url: _layer.url,
        definitionExpression: _layer.definitionExpression,
        raw: _layer,
        visible: _layer.visible
    })

    logger.log(`Adding a ${layerLabel} on map: ${layer.raw.title} | Visibility: ${layer.raw.visible} | URL: ${layer.raw.url}`)

    if (layer.raw.renderer) {
        logger.log(`Applying renderer...`)

        layer.renderer = jsonUtils.fromJSON(layer.raw.renderer)
    }

    // if (layer.raw.popupTemplate) {
    //     layer.popupTemplate = applyingPopups(layer.raw)
    // }

    layer.then(() => {
        logger.log(`Layer ${layer.title} ready!`)

        if (layer.raw.type === 1) {
            layer.minScale = layer.raw.minScale !== null &&
                parseInt(layer.raw.minScale) !== 0
                ? layer.raw.minScale
                : 0
            layer.maxScale = layer.raw.maxScale !== null &&
                parseInt(layer.raw.maxScale)
                ? layer.raw.maxScale
                : 0

            // logger.log(`minScale: ${parseInt(layer.minScale)} and maxScale: ${parseInt(layer.maxScale)} defined manually`)
        }
    })

    return layer
}

/**
 * Remove layer from map
 * @param  {String|Number} _layer - Layer title or ID
 * @return {Function} - Remove Layer on Map
 */
export const remove = _layer => {
    const map = global.map
    const layer = find(_layer)

    if (layer) {
        return map.remove(layer)
    } else {
        logger.error(`Can't find layer: ${_layer} in map. You already added this layer?`)
    }
}

/**
 * Find specific layer in map
 * @param  {String|Number} _layer - Layer title or ID
 * @return {Object} Layer that will be manipulated
 */
export const find = _layer => {
    const map = global.map

    return map.allLayers.find(layer => {
        if (layer.raw !== undefined) {
            if (layer.raw.title === _layer ||
                layer.raw.id === _layer) {
                return layer
            }
        }
    })
}

/**
 * get all layers included on map
 * @return {Array} list of all layers included by user
 */
export const all = () => {
    const map = global.map

    return map.allLayers._items.filter(layer => {
        if (layer.raw !== undefined) {
            return true
        }
    })
}

/**
 * Change layer visibility
 * @param  {String|Number} _layer - Layer title or ID
 * @param  {Boolean} visibility - Set if layer is visible or not
 */
export const setVisibility = (_layer, visibility) => {
    const layer = find(_layer)

    if (layer) {
        layer.visible = visibility
        logger.log(`Change visibility of layer: ${_layer} to: ${visibility}`)
    } else {
        logger.error(`Can't find layer: ${_layer} in map. You already added this layer?`)
    }
}

/**
 * Change layer opacity
 * @param  {String|Number} _layer - Layer title or ID
 * @param  {Number} _opacity - new opacity
 */
export const setOpacity = (_layer, _opacity) => {
    const layer = find(_layer)

    if (layer) {
        layer.opacity = _opacity / 100
        logger.log(`Change opacity of layer: ${_layer} to: ${_opacity}`)
    } else {
        logger.error(`Can't find layer: ${_layer} in map. You already added this layer?`)
    }
}

/**
 * Change visibility of all layers using parameter
 * @param  {String|Number} _layer - Layer title or ID
 * @param  {Boolean} visibility - Set if all layers will is visible or not
 */
const changeVisibility = (_layer, visibility) => {
    const map = global.map

    const toggle = layer => {
        if (layer.visible === !visibility) {
            layer.visible = visibility
            logger.log(`Change visibility of layer: ${layer.raw.title} to: ${visibility}`)
        }
    }

    map.allLayers.map(layer => {
        if (layer.raw !== undefined) {
            if (_layer &&
                layer.raw.title === _layer ||
                layer.raw.id === _layer) {
                toggle(layer)
            } else {
                toggle(layer)
            }
        }
    })
}

/**
 * Set visibility of all layers to false
 * @param  {String|Number} _layer - Layer title or ID
 */
export const hideAll = _layer => {
    changeVisibility(_layer, false)
}

/**
 * Set visibility of all layers to true
 * @param  {String|Number} _layer - Layer title or ID
 */
export const showAll = _layer => {
    changeVisibility(_layer, true)
}
