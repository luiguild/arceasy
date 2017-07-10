import * as logger from './logger'
import { global, constructors } from './config'

/**
 * Create view inside map
 * @param  {Object} map - The map object in memory
 * @param  {Function} View - ESRI View constructor
 * @param  {Object} options - Group of informations about your
 *                            app and how map will be
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
            atmosphereEnabled: options.atmosphere.enable
        })

        view.then(() => {
            logger.log('View ready!')

            controlUI(view)

            if (options.watcher) {
                watcherRunning(view)
            }
        })

        return view
    } else {
        logger.fatal(`Fatal error! You need set some map options.`)
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

    watchUtils.whenTrue(view, 'stationary', () => {
        logger.log(`View changed! Refreshing layers...`)
        // console.log(view.extent.center.latitude, view.extent.center.longitude, view.scale)

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
            if ((view.scale < layer.minScale &&
                    view.scale > layer.maxScale) ||
                    (layer.minScale === 0 &&
                    layer.maxScale === 0)) {
                if (layer.raw.type === 0) {
                    logger.log(`Getting extent to request ${layer.title}`)
                    logger.log(`Requesting to server: ${layer.raw.url}/where=${urlQuery}`)

                    layer.definitionExpression = urlQuery
                }
                layer.outOfRange = false

                if (layer.visible) {
                    logger.log(`Drawing layer: ${layer.title}`)
                }
            } else {
                if (layer.visible) {
                    logger.log('View changed but ' + layer.title + ' is out of range')
                }

                layer.outOfRange = true
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
 * Navigate on map using long/lat and camera position
 * @param  {Object} coordinates - Object that contain destiny longitude and latitude
 * @param  {Number} scale - Scale on earth
 * @param  {Object} camera - Object that contain new angles to position camera
 */
export const newPosition = ({coordinates, scale, camera}) => {
    if (coordinates && scale && camera) {
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
    } else {
        logger.error(`You need set a new position formed by a pair of coordinates, a new scale and new camera positions`)
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
        logger.error(`You need set a new basemap`)
    }
}
