import * as logger from './logger'
import { constructors, global } from './map'

const createLayer = layers => {
        layers.map((elm, indx, arr) => {
            let LayerConstructor

            if (elm.esri.type === 0) {
                logger.log(`Creating new Feature Layer...`)
                LayerConstructor = constructors.layer.FeatureLayer
            } else if (elm.esri.type === 1) {
                logger.log(`Creating new Tile Layer...`)
                LayerConstructor = constructors.layer.TileLayer
            }

            logger.log(`Adding id by index on layer`)
            elm.id = indx

            addNewLayer(
                LayerConstructor,
                constructors.utils.watchUtils,
                constructors.utils.jsonUtils,
                elm
            )
        })
    },
    addNewLayer = (LayerConstructor, watchUtils, jsonUtils, _layer) => {
        logger.log(`Adding layer on map: ${_layer.title} | Initial visibility: ${_layer.esri.visible}`)
        logger.log(`Loading layer from: ${_layer.esri.url}`)

        const layer = new LayerConstructor({
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
    },
    addGraphicLayer = (_symbol, _point) => {
        const map = global.map,
            GraphicsLayer = constructors.layer.GraphicsLayer,
            PointSymbol3D = constructors.renderer.PointSymbol3D,
            ObjectSymbol3DLayer = constructors.renderer.ObjectSymbol3DLayer,
            Point = constructors.renderer.Point,
            Graphic = constructors.renderer.Graphic,
            graphicsLayer = new GraphicsLayer({
                id: 'Point'
            }),
            objectSymbol = new PointSymbol3D({
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
            }),
            point = new Point({
                x: _point.x,
                y: _point.y,
                z: _point.z
            }),
            pointGraphic = new Graphic({
                geometry: point,
                symbol: objectSymbol
            })

        map.add(graphicsLayer)
        graphicsLayer.add(pointGraphic)

        logger.log(`Adding new Graphic Symbol...`)
    },
    visibility = (_layer, status) => {
        const map = global.map

        map.allLayers.map((elm, indx, arr) => {
            if (elm.raw !== undefined) {
                if (elm.raw.title === _layer) {
                    elm.visible = status
                    logger.log(`Change visibility of layer: ${_layer} to: ${status}`)
                }
            }
        })
    },
    opacity = (_layer, _opacity) => {
        const map = global.map

        map.allLayers.map((elm, indx, arr) => {
            if (elm.raw !== undefined) {
                if (elm.raw.title === _layer) {
                    elm.opacity = _opacity / 100
                    logger.log(`Change opacity of layer: ${_layer} to: ${_opacity}`)
                }
            }
        })
    },
    hideAll = () => {
        const map = global.map

        map.allLayers.map((elm, indx, arr) => {
            if (elm.raw !== undefined) {
                if (elm.visible === true) {
                    elm.visible = false
                    logger.log(`Change visibility of layer: ${elm.raw.title} to: ${false}`)
                }
            }
        })
    },
    removePoints = () => {
        const map = global.map

        map.allLayers.map((elm, indx, arr) => {
            if (elm.id === 'Point') {
                if (elm.visible === true) {
                    elm.visible = false
                    logger.log(`Remove point...`)
                }
            }
        })
    }
    // applyingPopups = layer => {
    //     logger.log(`Making popups...`)
    //
    //     const popupModel = {
    //         title: layer.esri.popupTemplate.title,
    //         content: [
    //             {
    //                 type: 'fields',
    //                 fieldInfos: []
    //             }
    //         ]
    //     }
    //
    //     layer.esri.popupTemplate.fieldInfos.forEach((cur, indx, arr) => {
    //         popupModel.content[0].fieldInfos.push(cur)
    //     })
    //
    //     return popupModel
    // }

export {
    createLayer,
    addNewLayer,
    addGraphicLayer,
    visibility,
    opacity,
    hideAll,
    removePoints
}
