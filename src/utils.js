import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Helper to add a simple point symbol on map using layer
 * @param {Object} _symbol - Some informations about your symbol
 * @param {String} _symbol.id - You can pass an ID to find this layer after
 * @param {Number} _symbol.width - Width of the symbol
 * @param {Number} _symbol.height - Height of the symbol
 * @param {String} _symbol.primitive - Name of the symbol
 * @param {String} _symbol.color - Color of the symbol
 * @param {Object} _point - Some information about the position of the symbol
 * @param {Number} _point.x - X axis position
 * @param {Number} _point.y - Y axis position
 * @param {Number} _point.z - Z axis position
 */
export const addGraphicLayer = (_symbol, _point) => {
    const map = global.map
    const GraphicsLayer = constructors.layer.GraphicsLayer
    const PointSymbol3D = constructors.renderer.PointSymbol3D
    const ObjectSymbol3DLayer = constructors.renderer.ObjectSymbol3DLayer
    const Point = constructors.renderer.Point
    const Graphic = constructors.renderer.Graphic

    const graphicsLayer = new GraphicsLayer({
        id: _symbol.id !== '' &&
            _symbol.id !== undefined
            ? _symbol.id
            : '[ArcE]Graph'
    })

    const objectSymbol = new PointSymbol3D({
        symbolLayers: [
            new ObjectSymbol3DLayer({
                width: _symbol.width,
                height: _symbol.height,
                resource: {
                    primitive: _symbol.primitive
                },
                material: {
                    color: _symbol.color
                }
            })
        ]
    })

    const point = new Point({
        x: _point.x,
        y: _point.y,
        z: _point.z
    })

    const pointGraphic = new Graphic({
        geometry: point,
        symbol: objectSymbol
    })

    map.add(graphicsLayer)
    graphicsLayer.add(pointGraphic)

    logger.log(`Adding a Graphic Layer on map...`)
}

export const hideGraphicLayers = () => {
    const map = global.map

    map.allLayers.map((elm, indx, arr) => {
        if (elm.id === '[ArcE]Graph') {
            if (elm.visible === true) {
                elm.visible = false
                logger.log(`Hiding Graphic Layer...`)
            }
        }
    })
}
