import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Recieve all layers to add on map
 * @constructor
 * @param  {Array} layers - List of layers
 * @param  {Number} layers[].esri.type - Define the type of layer
 * @param  {Number} [layers[].esri.type = 0] - Layer is FeatureLayer
 * @param  {Number} [layers[].esri.type = 1] - Layer is TileLayer
 */
const create = layers => {
    const layerConstructors = constructors.layer
    const utilsConstructors = constructors.utils
    let finalConstructor

    layers.forEach((layer, indx) => {
        if (layer.esri.type === 0) {
            logger.log(`Creating new Feature Layer...`)
            finalConstructor = layerConstructors.FeatureLayer
        } else if (layer.esri.type === 1) {
            logger.log(`Creating new Tile Layer...`)
            finalConstructor = layerConstructors.TileLayer
        }

        logger.log(`Adding id by index on layer`)
        layer.id = indx

        addNew(
            finalConstructor,
            utilsConstructors.watchUtils,
            utilsConstructors.jsonUtils,
            layer
        )
    })
}

/**
 * Recieve a single layer object and add on map
 * @param {Function} constructor - ESRI Layer Constructor
 * @param {Function} watchUtils - ESRI watcher Constructor
 * @param {Function} jsonUtils - ESRI JSON Utility Constructor
 * @param {Object} _layer - Valid Layer object previously worked
 */
const addNew = (constructor, watchUtils, jsonUtils, _layer) => {
    logger.log(`Adding layer on map: ${_layer.title} | Initial visibility: ${_layer.esri.visible}`)
    logger.log(`Loading layer from: ${_layer.esri.url}`)

    const layer = new constructor({
        id: _layer.id,
        url: _layer.esri.url,
        definitionExpression: _layer.esri.definitionExpression,
        raw: _layer,
        visible: _layer.esri.visible
    })

    if (layer.raw.esri.renderer) {
        logger.log(`Applying renderer...`)

        layer.renderer = jsonUtils.fromJSON(layer.raw.esri.renderer)
    }

    // if (layer.raw.esri.popupTemplate) {
    //     layer.popupTemplate = applyingPopups(layer.raw)
    // }

    layer.then(() => {
        logger.log(`Layer ${layer.title} ready!`)
        logger.log(`View waiting changes...`)

        if (layer.raw.esri.type === 1) {
            layer.minScale = layer.raw.esri.minScale !== null
                ? layer.raw.esri.minScale
                : 0
            layer.maxScale = layer.raw.esri.maxScale !== null
                ? layer.raw.esri.maxScale
                : 0

            logger.log(`minScale: ${layer.minScale} and maxScale: ${layer.maxScale} defined manually`)
        }
    })

    global.map.add(layer)
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
    create,
    addNew,
    setVisibility,
    setOpacity,
    hideAll,
    showAll
}
