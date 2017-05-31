import * as logger from './logger'
import { constructors, templates } from './config'

/**
 * Simple function to retrieve the renderers and symbols contructors
 * and apply on templates config global variables
 */
export const createRenderers = () => {
    const UniqueValueRenderer = constructors.uniqueValueRenderer
    const SimpleRenderer = constructors.simpleRenderer
    const ClassBreaksRenderer = constructors.classBreaksRenderer

    const PolygonSymbol3D = constructors.polygonSymbol3D
    const ExtrudeSymbol3DLayer = constructors.extrudeSymbol3DLayer
    const SimpleMarkerSymbol = constructors.simpleMarkerSymbol
    const SimpleLineSymbol = constructors.simpleLineSymbol
    const SimpleFillSymbol = constructors.simpleFillSymbol

    const renderers = [
        {
            name: 'UniqueValueRenderer',
            renderer: new UniqueValueRenderer({})
        },
        {
            name: 'SimpleRenderer',
            renderer: new SimpleRenderer({})
        },
        {
            name: 'GradientRenderer',
            renderer: new SimpleRenderer({})
        },
        {
            name: 'ClassBreaksRenderer',
            renderer: new ClassBreaksRenderer({})
        }
    ]

    const symbols = [
        {
            name: 'PolygonSymbol3D',
            symbol: new PolygonSymbol3D({
                symbolLayers: [
                    new ExtrudeSymbol3DLayer({})
                ]
            })
        },
        {
            name: 'SimpleFillSymbol',
            symbol: new SimpleFillSymbol({
                outline: new SimpleLineSymbol({})
            })
        },
        {
            name: 'SimpleMarkerSymbol',
            symbol: new SimpleMarkerSymbol({})
        }
    ]

    templates.renderers.push(renderers)
    templates.symbols.push(symbols)
}

/**
 * Get renderer on template by name
 * @param  {String} _renderer - Name of the rendereder
 * @return {Object} Renderer constructor template
 */
const getRenderer = _renderer => {
    return templates.renderers.filter(renderer => {
        if (renderer.name === _renderer) {
            return true
        }
    })
}

/**
 * Get symbol on template by name
 * @param  {String} _symbol - Name of the symbol
 * @return {Object} Symbol constructor template
*/
const getSymbol = _symbol => {
    return templates.symbols.filter(symbol => {
        if (symbol.name === _symbol) {
            return true
        }
    })
}

/**
 * Simnple function to convert hexa color to RGBA
 * @param  {String} hex - Hexa color
 * @return {Array} The RGBA final color
 */
const hexToRgbA = hex => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b
    })

    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
        255
    ] : null
}

/**
 * Recieve exa color like #FFF, convert to RGBA and parse to JSON format
 * @param  {String} color - Exa color
 * @return {Object} Parsed RGBA color
 */
const parseColor = color => {
    return JSON.parse(`[${hexToRgbA(color)}]`)
}

/**
 * A big function to set dynamically renderer on layer
 * This function support these Renderers
 * 'UniqueValueRenderer'
 * 'SimpleRenderer'
 * 'GradientRenderer'
 * 'ClassBreaksRenderer'
 * And these symbols
 * 'PolygonSymbol3D'
 * 'SimpleFillSymbol'
 * 'SimpleMarkerSymbol'
 * @param {Object} _layer - The complete layer object on map
 * @param {String} _renderer - The renderer name can be: UniqueValueRenderer / SimpleRenderer / GradientRenderer
 * @param {Array} _classes - Array that describes all information about your data classes
 * @param {String} _classes[].fill.color - The color fill information about the class index
 * @param {String} _classes[].outline.color - The outline color information
 * @param {Number} _classes[].outline.width - The outline width information
 * @param {Number} _classes[].point.size - If layer geometry is Point this will describe tha size of these points
 * @param {String} _classes[].point.style - The point style can be: Circle / Cross / Diamond / Square
 * @param {Number} _classes[].min - This min value will be used to create range starting at this point
 * @param {Number} _classes[].max - This max value will be used to create range ending at this point
 * @param {String} _classes[].value - This value will be used to set unique information about this class
 * @param {String} _classes[].label - The label can be used in layer subtitles
 * @param {String} _field - The data field layer that map will consume information to apply the rederer
 * @param {String} _extrude - The data field layer that map will extract information about extrusion
 * @param {Number} _multiplier - This number will used on create a math expression to extrude your information
 */
export const setRenderer = ({_layer, _renderer, _classes, _field, _extrude, _multiplier}) => {
    // If any conditions isn't found, abort
    if (!_layer ||
        !_renderer ||
        !_field) {
        logger.error(`You need set a layer, a renderer and one data field at minimum`)
        return
    }

    if (!_classes.length > 0) {
        logger.error(`You need set some classes`)
        return
    }

    if (!_classes[0].fill.color) {
        logger.error(`You need set one class with color`)
        return
    }

    if (_layer.raw.type === 0) {
        // Construct some variables
        const geometryType = _layer.geometryType
        const pureRenderer = getRenderer(_renderer)
        const newRenderer = Object.create(pureRenderer)

        let Symbol
        let newSymbol

        logger.log(`Create a new renderer using template: ${_renderer}`)

        // Create newRederer instance
        newRenderer['visualVariables'] = []
        newRenderer['classBreakInfos'] = []
        newRenderer['uniqueValueInfos'] = []
        newRenderer['symbol'] = ''
        newRenderer['field'] = _field
        newRenderer['label'] = ''

        // Get geometry from layer
        if (geometryType === 'polygon') {
            Symbol = getSymbol('SimpleFillSymbol')
            logger.log(`Applying Simple Polygon Symbol`)
        } else if (geometryType === 'point') {
            Symbol = getSymbol('SimpleMarkerSymbol')
            logger.log(`Applying Simple Marker Symbol`)
        }

        // If 3D option is enabled
        if (_extrude) {
            const info = {
                type: 'size',
                field: _extrude,
                label: '',
                valueExpression: `$feature.${_extrude} * ${_multiplier}`
            }

            logger.log('Applying 3D Symbol')

            Symbol = getSymbol('PolygonSymbol3D')
            newRenderer.symbol = Object.create(Symbol)
            newRenderer.visualVariables.push(info)
        }

        // classBreaksRenderer
        if (_renderer === 'ClassBreaksRenderer') {
            _classes.forEach((elm, indx) => {
                const fillColor = parseColor(elm.fill.color)
                const outilineColor = parseColor(elm.outline.color)
                const outlineWidth = elm.outline.width

                if (!newRenderer.symbol) {
                    newSymbol = Symbol.clone()
                    newSymbol.color = fillColor
                    newSymbol.outline.color = outilineColor
                    newSymbol.outline.width = outlineWidth

                    if (geometryType === 'point') {
                        const pointSize = parseInt(elm.point.size)
                        const pointStyle = elm.point.style

                        newSymbol.size = pointSize
                        newSymbol.style = pointStyle
                    }
                } else {
                    newSymbol = Symbol.clone()
                    newSymbol.symbolLayers.items[0].material = {
                        color: fillColor
                    }
                }

                newRenderer.classBreakInfos.push({
                    minValue: parseInt(elm.min),
                    maxValue: parseInt(elm.max),
                    symbol: newSymbol
                })
            })
        }

        // GradientRenderer
        if (_renderer === 'GradientRenderer') {
            const outilineColor = parseColor(_classes[0].outline.color)
            const outlineWidth = _classes[0].outline.width
            const info = {
                type: 'color',
                field: _field,
                stops: []
            }

            let classValue

            if (!newRenderer.symbol) {
                newSymbol = Symbol.clone()
                newSymbol.outline.color = outilineColor
                newSymbol.outline.width = outlineWidth

                if (geometryType === 'point') {
                    const pointSize = parseInt(_classes[0].point.size)
                    const pointStyle = _classes[0].point.style

                    newSymbol.size = pointSize
                    newSymbol.style = pointStyle
                }
            }

            _classes.forEach((elm, indx) => {
                const fillColor = parseColor(elm.fill.color)

                if (elm.value.content !== undefined) {
                    if (elm.value.type === 'number') {
                        classValue = parseInt(elm.value.content)
                    } else if (elm.value.type === 'text') {
                        classValue = elm.value.content.toString()
                    }
                }

                info.stops.push({
                    value: classValue,
                    color: fillColor,
                    label: elm.label || ''
                })
            })

            newRenderer.visualVariables.push(info)
        }

        // SimpleRenderer
        if (_renderer === 'SimpleRenderer') {
            const fillColor = parseColor(_classes[0].fill.color)
            const outilineColor = parseColor(_classes[0].outline.color)
            const outlineWidth = _classes[0].outline.width

            if (!newRenderer.symbol) {
                newSymbol = Symbol.clone()
                newSymbol.color = fillColor
                newSymbol.outline.color = outilineColor
                newSymbol.outline.width = outlineWidth

                if (geometryType === 'point') {
                    const pointSize = parseInt(_classes[0].point.size)
                    const pointStyle = _classes[0].point.style

                    newSymbol.size = pointSize
                    newSymbol.style = pointStyle
                }
            } else {
                newSymbol.symbolLayers.items[0].material = {
                    color: fillColor
                }
            }
        }

        // UniqueValueRenderer
        if (_renderer === 'UniqueValueRenderer') {
            let classValue

            _classes.forEach((elm, indx) => {
                const fillColor = parseColor(elm.fill.color)
                const outilineColor = parseColor(elm.outline.color)
                const outlineWidth = elm.outline.width

                if (elm.value.content !== undefined) {
                    if (elm.value.type === 'number') {
                        classValue = parseInt(elm.value.content)
                    } else if (elm.value.type === 'text') {
                        classValue = elm.value.content.toString()
                    }
                }

                if (!newRenderer.symbol) {
                    newSymbol = Symbol.clone()
                    newSymbol.color = fillColor
                    newSymbol.outline.color = outilineColor
                    newSymbol.outline.width = outlineWidth

                    if (geometryType === 'point') {
                        const pointSize = parseInt(elm.point.size)
                        const pointStyle = elm.point.style

                        newSymbol.size = pointSize
                        newSymbol.style = pointStyle
                    }
                } else {
                    newSymbol = Symbol.clone()
                    newSymbol.symbolLayers.items[0].material = {
                        color: fillColor
                    }
                }

                newRenderer.uniqueValueInfos.push({
                    value: classValue,
                    symbol: newSymbol
                })
            })
        }

        // Atribute the final instance of newSymbol on newRenderer
        newRenderer.symbol = newSymbol

        // Set renderer on layer
        const renderer = newRenderer.clone()
        _layer.renderer = Object.create(renderer)

        logger.log('New renderer was created!', JSON.stringify(newRenderer))
    }
}
