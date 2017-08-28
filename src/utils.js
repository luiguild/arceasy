import * as logger from './logger'
import { global, constructors } from './config'
import { find } from './layers'

/**
 * Abstract function to add a Graphic Layer on Map
 * @param {Object} info - Some informations about your layer
 * @param {String} info.id - You can pass an ID to find this layer after
 */
export const addGraphicLayer = ({ info }) => {
    const map = global.map
    const GraphicsLayer = constructors.layer.GraphicsLayer
    const layerId = info.id !== '' &&
        info.id !== undefined
        ? info.id
        : '[ArcE]Graph'

    const graphicsLayer = new GraphicsLayer({
        raw: {
            id: layerId
        }
    })

    map.add(graphicsLayer)

    logger.log(`Adding ${layerId} as a Graphic Layer on map...`)
}

/**
 * Helper to add a simple point or text symbol on map using layer
 * @param {Object} layer - Some informations about the container layer
 * @param {String|Number} layer.id - Layer title or ID
 * @param {String} popupTemplate - You can pass a popup template to show with your symbol
 * @param {String} popupTemplate.title - You can pass a title
 * @param {String} popupTemplate.content - You can pass a content
 * @param {Object} symbol - Some informations about your symbol
 * @param {Number} symbol.width - Width of the symbol
 * @param {Number} symbol.height - Height of the symbol
 * @param {String} symbol.primitive - Name of the symbol
 * @param {String} symbol.color - Color of the symbol
 * @param {Object} point - Some information about the position of the symbol
 * @param {Number} point.x - X axis position
 * @param {Number} point.y - Y axis position
 * @param {Number} point.z - Z axis position
 * @param {Object} text - Some information about the text content
 * @param {Number} text.color - Color of the text
 * @param {Number} text.content - The content
 * @param {Number} text.size - Size in pixels
 * @param {Number} text.font - Font family ex: FontAwesome
 */
export const addGraphicSymbol = ({layer, popupTemplate, symbol, point, text}) => {
    const PointSymbol3D = constructors.renderer.PointSymbol3D
    const ObjectSymbol3DLayer = constructors.renderer.ObjectSymbol3DLayer
    const Point = constructors.renderer.Point
    const TextSymbol = constructors.renderer.TextSymbol
    const Graphic = constructors.utils.Graphic
    const _layer = find(layer.id || '')

    const objectSymbol = new PointSymbol3D({
        symbolLayers: [
            new ObjectSymbol3DLayer({
                width: symbol !== undefined
                    ? symbol.width
                    : null,
                height: symbol !== undefined
                    ? symbol.height
                    : null,
                resource: {
                    primitive: symbol !== undefined
                        ? symbol.primitive
                        : null
                },
                material: {
                    color: symbol !== undefined
                        ? symbol.color
                        : null
                }
            })
        ]
    })

    const _point = new Point({
        x: point.x,
        y: point.y,
        z: point.z,
        latitude: point.latitude,
        longitude: point.longitude
    })

    const textSymbol = new TextSymbol({
        color: text !== undefined
            ? text.color
            : null,
        text: text !== undefined
            ? text.content
            : null,
        font: {
            size: text !== undefined
                ? text.size
                : null,
            family: text !== undefined
                ? text.font
                : null
        }
    })

    const pointGraphic = new Graphic({
        geometry: _point,
        symbol: symbol !== undefined
            ? objectSymbol
            : text !== undefined
            ? textSymbol
            : null,
        popupTemplate: {}
    })

    if (popupTemplate) {
        if (popupTemplate.title) {
            pointGraphic.popupTemplate.title = popupTemplate.title
        }

        if (popupTemplate.content) {
            pointGraphic.popupTemplate.content = popupTemplate.content
        }
    }

    if (_layer) {
        _layer.graphics.add(pointGraphic)
    } else {
        logger.error(`Can't find layer: ${layer} in map. You already added this layer?`)
    }
}
