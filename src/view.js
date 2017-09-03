import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Create view inside map
 * @param  {Object} map - The map object in memory
 * @param  {Function} View - ESRI View constructor
 * @param  {Object} options - Group of informations about your
 *                            app and how the map will be
 * @param  {String} options.cdn - ESRI CDN Server
 * @param  {String} options.element - DOM element that map will be created
 * @param  {Number} options.scale - Initial map scale
 * @param  {Number} options.center.longitude - Center map Longitude
 * @param  {Number} options.center.latitude - Center map Latitude
 * @param  {String} options.basemap - Initial basemap
 * @param  {Boolean} options.stars - If stars is enabled
 * @param  {Boolean} options.atmosphere.enable - If atmosphere is enabled
 * @param  {String} options.atmosphere.quality - Atmosphere quality
 * @param  {Boolean} options.watcher - If watcherRunning() is enabled
 * @param  {Boolean} options.light.cameraTracking - If you to display the
 *                                                lighting according to the
 *                                                current time of day
 * @param  {Boolean} options.search.enable - If search is enabled
 * @param  {String} options.search.position - Search position
 * @param  {Number} options.search.index - Search index
 * @param  {Array} options.cors - A group of URLs that you need enable CORS
 * @param  {String} options.proxy - Single URL that will proxy your requests
 * @return {Object} Global view object descriptor
 */
export const createView = (map, View, options) => {
    if (global.loaded) {
        logger.log('Creating View...')

        const view = new View({
            container: options.element,
            map: map,
            scale: options.scale,
            center: [
                options.center.longitude,
                options.center.latitude
            ],
            viewingMode: 'global',
            starsEnabled: options.stars,
            atmosphereEnabled: options.atmosphere.enable,
            loaded: true
        })

        view.then(() => {
            logger.log('View ready!')

            controlUI(view)
            // light({
            //     cameraTracking: options.light.cameraTracking,
            //     date: options.light.date
            // })

            if (options.watcher) {
                watcherRunning(view)
            }
        })

        return view
    } else {
        logger.fatal(`Fatal error! You need to set some map options.`)
    }
}

/**
 * Watcher that observe the globe moviment
 * and make requests with specific parameters
 * like extent on 'definitionExpression'
 * @param  {Object} view - Global view object descriptor
 */
const watcherRunning = view => {
    const watchUtils = constructors.utils.watchUtils

    logger.log(`Watcher running! Waiting changes on view.`)

    watchUtils.whenTrue(view, 'stationary', () => {
        logger.log(`View changed! Getting extent to refreshing layers...`)
        console.log(view.extent.center.latitude, view.extent.center.longitude, view.scale)

        refreshExtent(view)
    })
}

 /**
  * Function to get the actual extent and set the definition expression
  * on layer and make an request to refreh the layer info
  * @param  {Object} view - Global view object descriptor
  */
const refreshExtent = view => {
    const map = global.map
    const urlQuery = `!xmin=${view.extent.xmin}!xmax=${view.extent.xmax}!ymin=${view.extent.ymin}!ymax=${view.extent.ymax}`

    map.allLayers.map(layer => {
        if (layer.raw !== undefined) {
            if (layer.raw.progressive) {
                if ((view.scale < layer.minScale &&
                        view.scale > layer.maxScale) ||
                        (layer.minScale === 0 &&
                        layer.maxScale === 0)) {
                    if (layer.raw.type === 0) {
                        layer.definitionExpression = urlQuery
                    }
                    layer.outOfRange = false

                    if (layer.visible) {
                        logger.log(`Drawing progressive layer: ${layer.title} | URL requested: ${layer.raw.url}/where=${urlQuery}`)
                    }
                } else {
                    if (layer.visible) {
                        logger.log(`${layer.title} it's visible, but is out of range`)
                    }

                    layer.outOfRange = true
                }
            }
        }
    })
}

/**
 * Only setting some aspects from ESRI UI
 * @param  {Object} view - Global view object descriptor
 */
const controlUI = view => {
    logger.log('Changing UI elements...')

    view.environment.atmosphereEnabled = global.options.atmosphere.enable
    view.environment.atmosphere.quality = global.options.atmosphere.quality

    if (global.options.search.enable) {
        const Search = constructors.utils.Search
        const searchWidget = new Search({
            view: view
        })

        view.ui.add(searchWidget, {
            position: global.options.search.position,
            index: global.options.search.index
        })
    }

    view.ui.remove([
        'zoom',
        'compass',
        'navigation-toggle'
    ])
}

/**
 * Change camera tracking
 * @param  {Object} cameraTracking - Set the light on the world based on camera or not
 */
export const light = ({cameraTracking, date}) => {
    const view = global.view

    if (cameraTracking !== '' &&
        cameraTracking !== undefined) {
        logger.log(`Changing light camera tracking to: ${cameraTracking}`)
        view.environment.lighting.cameraTrackingEnabled = cameraTracking
    }

    if (date === 'now') {
        logger.log(`Changing light date to: ${date}`)
        view.environment.lighting.date = Date.now()
    }

    if (date === '' ||
        date === undefined) {
        view.environment.lighting.date = new Date('Jul 15 2017 12:00:00')
        logger.log(`Changing light date to: default - Jul 15 2017 12:00:00`)
    }
}

/**
 * Navigate on map using long/lat and camera position
 * @param  {Object} coordinates - Object that contains destiny longitude and latitude
 * @param  {Number} scale - Scale on earth
 * @param  {Object} camera - Object that contain new angles to position camera
 */
export const newPosition = ({extent, coordinates, scale, camera}) => {
    if (extent !== undefined ||
        coordinates !== undefined ||
        scale !== undefined ||
        camera !== undefined) {
        const view = global.view
        const Extent = constructors.utils.Extent
        let newExtent

        if (extent) {
            newExtent = new Extent({
                xmax: extent.xmax || '',
                xmin: extent.xmin || '',
                ymax: extent.ymax || '',
                ymin: extent.ymin || '',
                spatialReference: {
                    wkid: extent.spatialReference
                        ? extent.spatialReference.wkid
                        : ''
                }
            })
        }

        view.goTo({
            target: extent &&
                newExtent
                ? newExtent
                : '',
            center:
                coordinates &&
                coordinates.longitude &&
                coordinates.latitude
                ? [
                    coordinates.longitude,
                    coordinates.latitude
                ]
                : '',
            scale: scale || '',
            tilt: camera &&
                camera.tilt
                ? camera.tilt
                : '',
            heading: camera &&
                camera.heading
                ? camera.heading
                : '',
            position: camera &&
                camera.position
                ? camera.position
                : ''
        })

        logger.log(`Changing map position...`)
    } else {
        logger.error(`You need to set a new position formed by a pair of coordinates, a new scale and new camera position`)
    }
}

/**
 * Change basemap on global map object
 * @param  {String} basemap - A basemap name that match with basemap's list from ESRI
 *                          'streets', 'satellite', 'hybrid', 'topo', 'gray',
 *                          'dark-gray', 'oceans', 'national-geographic',
 *                          'terrain', 'osm', 'dark-gray-vector', 'gray-vector',
 *                          'streets-vector', 'topo-vector', 'streets-night-vector',
 *                          'streets-relief-vector', 'streets-navigation-vector'
 *                          or 'none'
 */
export const changeBasemap = basemap => {
    if (basemap) {
        const map = global.map

        map.basemap = basemap

        logger.log(`Change basemap...`)
    } else {
        logger.error(`You need to set a new basemap`)
    }
}
