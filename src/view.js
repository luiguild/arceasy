import * as logger from './logger'
import { constructors, global } from './map'

const createView = (map, View, config) => {
        logger.log('Creating View...')

        const search = constructors.utils.Search,
            watchUtils = constructors.utils.watchUtils,
            view = new View({
                container: config.element,
                map: map,
                scale: config.scale,
                center: [
                    config.longitude,
                    config.latitude
                ],
                viewingMode: 'global',
                starsEnabled: config.stars,
                atmosphereEnabled: config.atmosphere
            })

        view.then(() => {
            logger.log('View ready!')

            controlUI(view, search)
            watcherRunning(map, view, watchUtils)
        })

        return view
    },
    watcherRunning = (map, view, watchUtils) => {
        watchUtils.whenTrue(view, 'stationary', () => {
            if (view.extent) {
                logger.log(`View changed! Mapping all layers...`)

                console.log(view.extent.center.latitude, view.extent.center.longitude, view.scale)

                map.allLayers.map((elm, indx, arr) => {
                    if (((view.scale < elm.minScale &&
                            view.scale > elm.maxScale) ||
                            (elm.minScale === 0 &&
                            elm.maxScale === 0)) &&
                            (elm.raw !== undefined &&
                            elm.visible)) {
                        if (elm.raw.esri.type === 0) {
                            const urlQuery = `!xmin=${view.extent.xmin}!xmax=${view.extent.xmax}!ymin=${view.extent.ymin}!ymax=${view.extent.ymax}`

                            logger.log(`Getting extent to request ${elm.title}`)
                            logger.log(`Requesting to server: ${elm.raw.esri.url}/where=${urlQuery}`)

                            elm.definitionExpression = urlQuery
                        }

                        logger.log(`Drawing layer: ${elm.title}`)
                    }
                })
            }
        })
    },
    controlUI = (view, Search) => {
        logger.log('Changing UI elements...')
        view.environment.atmosphere.quality = 'low'

        const searchWidget = new Search({
            view: view
        })

        view.ui.add(searchWidget, {
            position: 'top-left',
            index: 2
        })

        view.ui.remove([
            'zoom',
            'compass',
            'navigation-toggle'
        ])
    },
    newPosition = ({coordinates, scale, camera}) => {
        const view = global.view

        view.goTo({
            center: [
                coordinates.longitude,
                coordinates.latitude
            ],
            scale: scale,
            tilt: camera.tilt,
            heading: camera.heading
        })

        logger.log(`Changing map position...`)
    },
    changeBasemap = basemap => {
        const map = global.map

        map.basemap = basemap

        logger.log(`Change basemap...`)
    }

export {
    createView,
    newPosition,
    changeBasemap
}
