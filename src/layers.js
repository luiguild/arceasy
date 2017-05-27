import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Recieve all layers, work and add on map
 * @constructor
 * @param  {Array} layers - List of layers
 */
const add = layers => {
    layers.map((layer, indx) => {
        if (validate(layer)) {
            logger.log(`Adding id by index on layer`)
            layer.id = indx

            global.map.add(create(layer))
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
            !layer.type) {
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
const create = (_layer) => {
    const layerConstructors = constructors.layer
    const utilsConstructors = constructors.utils
    const jsonUtils = utilsConstructors.jsonUtils
    let LayerType

    if (_layer.type === 0) {
        logger.log(`Creating new Feature Layer...`)
        LayerType = layerConstructors.FeatureLayer
    } else if (_layer.type === 1) {
        logger.log(`Creating new Tile Layer...`)
        LayerType = layerConstructors.TileLayer
    }

    logger.log(`Adding layer on map: ${_layer.title} | Initial visibility: ${_layer.visible}`)

    const layer = new LayerType({
        id: _layer.id,
        url: _layer.url,
        definitionExpression: _layer.definitionExpression,
        raw: _layer,
        visible: _layer.visible
    })

    logger.log(`Loading layer from: ${_layer.url}`)

    if (layer.raw.renderer) {
        logger.log(`Applying renderer...`)

        layer.renderer = jsonUtils.fromJSON(layer.raw.renderer)
    }

    // if (layer.raw.popupTemplate) {
    //     layer.popupTemplate = applyingPopups(layer.raw)
    // }

    layer.then(() => {
        logger.log(`Layer ${layer.title} ready!`)
        logger.log(`View waiting changes...`)

        if (layer.raw.type === 1) {
            layer.minScale = layer.raw.minScale !== null
                ? layer.raw.minScale
                : 0
            layer.maxScale = layer.raw.maxScale !== null
                ? layer.raw.maxScale
                : 0

            logger.log(`minScale: ${layer.minScale} and maxScale: ${layer.maxScale} defined manually`)
        }
    })

    return layer
}

/**
 * Find specific layer in map
 * @param  {String|Number} _layer - Layer title or ID
 * @return {Object} Layer that will be manipulated
 */
const findLayer = _layer => {
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
 * Change layer visibility
 * @param  {String|Number} _layer - Layer title or ID
 * @param  {Boolean} visibility - Set if layer is visible or not
 */
const setVisibility = (_layer, visibility) => {
    const layer = findLayer(_layer)

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
const setOpacity = (_layer, _opacity) => {
    const layer = findLayer(_layer)

    if (layer) {
        layer.opacity = _opacity / 100
        logger.log(`Change opacity of layer: ${_layer} to: ${_opacity}`)
    } else {
        logger.error(`Can't find layer: ${_layer} in map. You already added this layer?`)
    }
}

/**
 * Change visibility of all layers using parameter
 * @param  {Boolean} visibility - new opacity
 */
const changeVisibility = visibility => {
    const map = global.map

    map.allLayers.map(layer => {
        if (layer.raw !== undefined) {
            if (layer.visible === !visibility) {
                layer.visible = visibility
                logger.log(`Change visibility of layer: ${layer.raw.title} to: ${visibility}`)
            }
        }
    })
}

/**
 * Set visibility of all layers to false
 */
const hideAll = () => {
    changeVisibility(false)
}

/**
 * Set visibility of all layers to true
 */
const showAll = () => {
    changeVisibility(true)
}

export {
    add,
    setVisibility,
    setOpacity,
    hideAll,
    showAll
}
