// import * as logger from './logger'
import { constructors, templates } from './config'

/**
 * [createRenderers description]
 * @return {[type]} [description]
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
 * [setRenderer description]
 * @param {[type]} _layer     [description]
 * @param {[type]} _renderer  [description]
 * @param {[type]} classes    [description]
 * @param {[type]} field      [description]
 * @param {[type]} extrude    [description]
 * @param {[type]} multiplier [description]
 * @param {[type]} line       [description]
 * @param {[type]} fill       [description]
 */
// export const setRenderer = ({_layer, _renderer, classes, field, extrude, multiplier, line, fill}) => {
//     const geometryType = _layer.geometryType
//
//     const pureRenderer = templates.renderers.filter(renderer => {
//         if (renderer.name === _renderer) {
//             return true
//         }
//     })
//     const newRenderer = Object.create(pureRenderer)
//     newRenderer.visualVariables = []
//     newRenderer.classBreakInfos = []
//     newRenderer.symbol = ''
//
//     logger.log(`Create a new renderer using template: ${_renderer}`)
//
//     if (line.color === '' ||
//         line.color === undefined ||
//         !line.color) {
//         line.color = '#ffffff'
//     }
//
//     if (extrude) {
//         const info = {
//             type: 'size',
//             field: extrude,
//             label: '',
//             valueExpression: `$feature.${extrude} * ${multiplier}`
//         }
//
//         const symbolName = templates.symbols[0]['name']
//         const pureSymbol = templates.symbols[0]['symbol']
//
//         logger.log(`Create a new symbol using template: ${symbolName}`)
//
//         newRenderer.symbol = Object.create(pureSymbol)
//
//         if (newRenderer.visualVariables.length > 0) {
//             newRenderer.visualVariables.push(info)
//         } else {
//             newRenderer.visualVariables = [info]
//         }
//
//         // console.log(JSON.stringify(info))
//     }
//
//     if (geometryType === 'polygon') {
//         if (_renderer === 'ClassBreaksRenderer') {
//             if (fill.length > 0 && fill !== undefined) {
//                 const info = []
//                 const symbolValue = {}
//
//                 newRenderer.field = field
//
//                 for (let i = 0; i < classes; i++) {
//                     if (!fill[i]) {
//                         return
//                     }
//
//                     if (!newRenderer.symbol) {
//                         const symbolName = templates.symbols[1]['name']
//                         const pureSymbol = templates.symbols[1]['symbol']
//                         const symbolValue = pureSymbol.clone()
//
//                         logger.log(`Create a new symbol using template: ${symbolName}`)
//
//                         symbolValue.color = JSON.parse('[' + this.hexToRgb(fill[i]) + ']')
//                         symbolValue.outline.color = JSON.parse('[' + this.hexToRgb(line.color) + ']')
//                         symbolValue.outline.width = line.width
//                     } else {
//                         const symbolName = templates.symbols[0]['name']
//                         const pureSymbol = templates.symbols[0]['symbol']
//                         const symbolValue = pureSymbol.clone()
//
//                         logger.log(`Create a new symbol using template: ${symbolName}`)
//
//                         symbolValue.symbolLayers.items[0].material = {
//                             color: JSON.parse('[' + this.hexToRgb(fill[i]) + ']')
//                         }
//                     }
//
//                     info.push({
//                         minValue: parseInt(classes[i].min),
//                         maxValue: parseInt(classes[i].max),
//                         symbol: symbolValue
//                     })
//                 }
//                 newRenderer.classBreakInfos = info
//                 // console.log(JSON.stringify(info))
//             }
//         } else if (_renderer === 'SimpleRenderer' && this.renderers === '5') {
//             if (fill.length > 0 && fill !== undefined) {
//                 let arrayDoColorDeCu = {
//                         type: 'color',
//                         field: this.selectedFieldsOnMap,
//                         stops: []
//                     },
//                     classValue
//
//                 newRenderer.field = this.selectedFieldsOnMap
//
//                 if (!newRenderer.symbol) {
//                     logger.log('Create a new symbol using template: ' + this.computedSymbols[1]['name'])
//                     pureSymbol = this.computedSymbols[1]['obj']['symbol']
//                     newRenderer.symbol = pureSymbol.clone()
//                     newRenderer.symbol.outline.color = JSON.parse('[' + this.hexToRgb(this.inputLineColor) + ']')
//                     newRenderer.symbol.outline.width = this.line.width
//                 }
//
//                 newRenderer.label = ''
//
//                 for (let i = 0; i < this.classesNumber; i++) {
//                     if (!fill[i]) {
//                         return
//                     }
//
//                     if (this.manualColors[i].value !== undefined) {
//                         if (this.typeClassValue === 'number') {
//                             classValue = parseInt(this.manualColors[i].value)
//                         } else if (this.typeClassValue === 'text') {
//                             classValue = this.manualColors[i].value.toString()
//                         }
//                     }
//
//                     arrayDoColorDeCu.stops.push({
//                         value: classValue,
//                         color: JSON.parse('[' + this.hexToRgb(fill[i]) + ']'),
//                         label: this.manualColors[i].label ? this.manualColors[i].label : ''
//                     })
//                 }
//
//                 if (newRenderer.visualVariables.length > 0) {
//                     newRenderer.visualVariables.push(arrayDoColorDeCu)
//                 } else {
//                     newRenderer.visualVariables = [arrayDoColorDeCu]
//                 }
//
//                 // console.log(JSON.stringify([arrayDoColorDeCu]))
//             }
//         } else if (_renderer === 'SimpleRenderer') {
//             if (this.inputSimpleFillColor !== '' && fill !== undefined) {
//                 if (!newRenderer.symbol) {
//                     logger.log('Create a new symbol using template: ' + this.computedSymbols[1]['name'])
//                     pureSymbol = this.computedSymbols[1]['obj']['symbol']
//                     newRenderer.symbol = pureSymbol.clone()
//
//                     newRenderer.symbol.outline.color = JSON.parse('[' + this.hexToRgb(this.inputLineColor) + ']')
//                     newRenderer.symbol.outline.width = this.line.width
//                     newRenderer.symbol.color = JSON.parse('[' + this.hexToRgb(this.inputSimpleFillColor) + ']')
//                 } else {
//                     newRenderer.symbol.symbolLayers.items[0].material = {
//                         color: JSON.parse('[' + this.hexToRgb(this.inputSimpleFillColor) + ']')
//                     }
//                 }
//             }
//         } else if (_renderer === 'UniqueValueRenderer') {
//             if (fill.length > 0 && fill !== undefined) {
//                 let arrayUnicoDeCu = [],
//                     classValue,
//                     symbolValue = {}
//
//                logger.log('Create a new symbol using template: ' + this.computedSymbols[1]['name'])
//                 newRenderer.field = this.selectedFieldsOnMap
//
//                 for (let i = 0; i < this.classesNumber; i++) {
//                     if (this.manualColors[i].value !== undefined) {
//                         if (this.typeClassValue === 'number') {
//                             classValue = parseInt(this.manualColors[i].value)
//                         } else if (this.typeClassValue === 'text') {
//                             classValue = this.manualColors[i].value.toString()
//                         }
//                     }
//
//                     if (!newRenderer.symbol) {
//                         logger.log('Create a new symbol using template: ' + this.computedSymbols[1]['name'])
//                         pureSymbol = this.computedSymbols[1]['obj']['symbol']
//                         symbolValue = pureSymbol.clone()
//                         symbolValue.color = JSON.parse('[' + this.hexToRgb(fill[i]) + ']')
//                         symbolValue.outline.color = JSON.parse('[' + this.hexToRgb(this.inputLineColor) + ']')
//                         symbolValue.outline.width = this.line.width
//                     } else {
//                         pureSymbol = this.computedSymbols[0]['obj']['defaultSymbol']
//                         symbolValue = pureSymbol.clone()
//                         symbolValue.symbolLayers.items[0].material = {
//                             color: JSON.parse('[' + this.hexToRgb(fill[i]) + ']')
//                         }
//                     }
//
//                     arrayUnicoDeCu.push({
//                         value: classValue,
//                         symbol: symbolValue
//                     })
//                 }
//                 newRenderer.uniqueValueInfos = arrayUnicoDeCu
//                 // console.log(JSON.stringify(arrayUnicoDeCu))
//             }
//         }
//     } else if (geometryType === 'point') {
//         if (_renderer === 'SimpleRenderer') {
//             if (this.inputSimpleFillColor !== '' && fill !== undefined) {
//                 if (!newRenderer.symbol) {
//                     logger.log('Create a new symbol using template: ' + this.computedSymbols[2]['name'])
//                     pureSymbol = this.computedSymbols[2]['obj']['symbol']
//                     newRenderer.symbol = pureSymbol.clone()
//
//                     newRenderer.symbol.outline.color = JSON.parse('[' + this.hexToRgb(this.inputLineColor) + ']')
//                     newRenderer.symbol.outline.width = this.line.width
//                     newRenderer.symbol.color = JSON.parse('[' + this.hexToRgb(this.inputSimpleFillColor) + ']')
//                 } else {
//                     newRenderer.symbol.symbolLayers.items[0].material = {
//                         color: JSON.parse('[' + this.hexToRgb(this.inputSimpleFillColor) + ']')
//                     }
//                 }
//             }
//         }
//     }
//
//     console.log(JSON.stringify(newRenderer))
//
//     this.addRendererOnLayer({
//         index: this.computedLayerSelected,
//         rendererTemplate: newRenderer
//     })
// }
