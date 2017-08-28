import * as esriLoader from 'esri-loader'
import * as logger from './logger'
import { createView } from './view'
import { global, constructors } from './config'

/**
 * Simple function to set globaly options about the map
 * To start using ArcEasy you need invocate this function first
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
 * @param  {Boolean} options.light.cameraTracking - If you to display the
 *                                                lighting according to the
 *                                                current time of day
 * @param  {Boolean} options.search.enable - If search is enabled
 * @param  {String} options.search.position - Search position
 * @param  {Number} options.search.index - Search index
 * @param  {Array} options.cors - A group of URLs that you need enable CORS
 * @param  {String} options.proxy - Single URL that will proxy your requests
 */
export const options = options => {
    if (options) {
        options.cdn ||
            logger.warn(`You not set any ESRI CDN. Usign default: ${global.options.cdn}`)

        options.element ||
            logger.fatal(`You need pass an valid DOM element`)

        options.scale ||
            logger.warn(`You not set scale. Usign default scale: ${global.options.scale}`)

        if (options.center) {
            options.center.longitude ||
                logger.warn(`You not set intial longitude. Usign default: ${global.options.center.longitude}`)

            options.center.latitude ||
                logger.warn(`You not set intial latitude. Usign default: ${global.options.center.latitude}`)
        } else {
            logger.warn(`You not set the map center. Usign defaults | longitude: ${global.options.center.longitude}, latitude: ${global.options.center.latitude}`)
        }

        options.basemap ||
            logger.warn(`You not set initial basemap. Usign default: ${global.options.basemap}`)

        options.stars === true ||
        options.stars === false ||
            logger.warn(`You not set if map usign stars. Usign default: ${global.options.stars}`)

        if (options.atmosphere) {
            options.atmosphere.enable === true ||
            options.atmosphere.enable === false ||
                logger.warn(`You not set if map usign atmosphere efect. Usign default: ${global.options.atmosphere.enable}`)

            options.atmosphere.quality ||
                logger.warn(`You not set atmosphere quality. Usign default: ${global.options.atmosphere.quality}`)
        } else {
            logger.warn(`You not set the atmosphere options. Usign defaults | enable: ${global.options.atmosphere.enable}, quality: ${global.options.atmosphere.quality}`)
        }

        options.watcher === true ||
        options.watcher === false ||
            logger.warn(`You not set if map usign watcher to refresh the layers. Usign default: ${global.options.watcher}`)

        if (options.light) {
            options.light.cameraTracking === true ||
            options.light.cameraTracking === false ||
                logger.warn(`You not set the camera tracking options. Usign default: ${global.options.light.cameraTracking}`)

            options.light.date === '' ||
            options.light.date === undefined ||
                logger.warn(`You not set a date to view light position.`)
        } else {
            logger.warn(`You not set the light options. Usign default for camera tracking: ${global.options.light.cameraTracking}`)
        }

        if (options.search) {
            options.search.enable === true ||
            options.search.enable === false ||
                logger.warn(`You not set Search. Usign default: ${global.options.search.enable}`)

            options.search.position ||
                logger.warn(`You not set Search position. Usign default: ${global.options.search.position}`)

            options.search.index ||
                logger.warn(`You not set Search index. Usign default: ${global.options.search.index}`)
        } else {
            logger.warn(`You not set the search options. Usign defaults | enable: ${global.options.search.enable}, position: ${global.options.search.position}, index: ${global.options.search.index}`)
        }

        options.cors &&
        options.cors.length > 0 ||
            logger.warn(`You not set any URL to enable CORS requests`)

        options.proxy ||
            logger.warn(`You not set any URL to proxy your requests`)

        global.options = {
            cdn: options.cdn !== '' &&
                options.cdn !== undefined
                ? options.cdn
                : global.options.cdn,
            element: options.element,
            scale: options.scale !== '' &&
                options.scale !== undefined
                ? options.scale
                : global.options.scale,
            center: {
                longitude: options.center &&
                    options.center.longitude !== '' &&
                    options.center.longitude !== undefined
                    ? options.center.longitude
                    : global.options.center.longitude,
                latitude: options.center &&
                    options.center.latitude !== '' &&
                    options.center.latitude !== undefined
                    ? options.center.latitude
                    : global.options.center.latitude
            },
            basemap: options.basemap !== '' &&
                options.basemap !== undefined
                ? options.basemap
                : global.options.basemap,
            stars: options.stars !== '' &&
                options.stars !== undefined
                ? options.stars
                : global.options.stars,
            atmosphere: {
                enable: options.atmosphere &&
                    options.atmosphere.enable !== '' &&
                    options.atmosphere.enable !== undefined
                    ? options.atmosphere.enable
                    : global.options.atmosphere.enable,
                quality: options.atmosphere &&
                    options.atmosphere.quality !== '' &&
                    options.atmosphere.quality !== undefined
                    ? options.atmosphere.quality
                    : global.options.atmosphere.quality
            },
            watcher: options.watcher !== '' &&
                options.watcher !== undefined
                ? options.watcher
                : global.options.watcher,
            light: {
                cameraTracking: options.light &&
                options.light.cameraTracking !== '' &&
                options.light.cameraTracking !== undefined
                ? options.light.cameraTracking
                : global.options.light.cameraTracking,
                date: options.light &&
                options.light.date !== '' &&
                options.light.date !== undefined
                ? options.light.date
                : global.options.light.date
            },
            search: {
                enable: options.search &&
                    options.search.enable !== '' &&
                    options.search.enable !== undefined
                    ? options.search.enable
                    : global.options.search.enable,
                position: options.search &&
                    options.search.position !== '' &&
                    options.search.position !== undefined
                    ? options.search.position
                    : global.options.search.position,
                index: options.search &&
                    options.search.index !== '' &&
                    options.search.index !== undefined
                    ? options.search.index
                    : global.options.search.index
            },
            cors: options.cors !== '' &&
                options.cors !== undefined
                ? options.cors
                : '',
            proxy: options.proxy !== '' &&
                options.proxy !== undefined
                ? options.proxy
                : ''
        }

        global.loaded = true
        logger.log(`Ready to start!`)
    } else {
        logger.fatal(`You need pass some informations to describe your map`)
    }
}

/**
 * The BigBang function
 * To create your map you need invocate this function
 */
export const start = () => {
    return new Promise((resolve, reject) => {
        const cdn = global.options.cdn

        if (cdn !== undefined && global.loaded) {
            // Has the ArcGIS API been added to the page?
            if (!esriLoader.isLoaded()) {
                // No, lazy load it the ArcGIS API before using its classes
                esriLoader.bootstrap(err => {
                    if (err) {
                        logger.error(err)
                    }
                    // Once it's loaded, create the map
                    logger.log(`Waiting ESRI server...`)
                    dojoLoader(resolve, reject)
                }, {
                    // Use a specific version instead of latest 4.x
                    url: cdn
                })
            } else {
                // ArcGIS API is already loaded, just create the map
                logger.log(`Waiting ESRI server...`)
                dojoLoader(resolve, reject)
            }
        } else {
            logger.fatal(`Fatal error! You must provider an CDN.`)
            reject()
        }
    })
}

/**
 * Require all packages from ESRI CDN,
 * create necessary constructors,
 * create map,
 * create view,
 * and put in page
 */
const dojoLoader = (resolve, reject) => {
    if (global.loaded) {
        esriLoader.dojoRequire([
            'esri/config',
            'esri/Map',
            'esri/Graphic',
            'esri/Camera',
            'esri/WebScene',
            'esri/request',
            'esri/Color',

            'esri/views/SceneView',
            'esri/views/3d/externalRenderers',

            'esri/layers/FeatureLayer',
            'esri/layers/TileLayer',
            'esri/layers/GraphicsLayer',
            'esri/layers/PointCloudLayer',
            'esri/layers/SceneLayer',
            'esri/layers/support/LabelClass',

            'esri/core/watchUtils',
            'esri/core/Collection',
            'esri/core/declare',
            'esri/core/lang',

            'esri/renderers/UniqueValueRenderer',
            'esri/renderers/ClassBreaksRenderer',
            'esri/renderers/SimpleRenderer',
            'esri/renderers/support/jsonUtils',
            'esri/renderers/PointCloudUniqueValueRenderer',
            'esri/renderers/PointCloudRGBRenderer',
            'esri/renderers/PointCloudStretchRenderer',
            'esri/renderers/PointCloudClassBreaksRenderer',
            'esri/renderers/smartMapping/creators/color',

            'esri/symbols/ExtrudeSymbol3DLayer',
            'esri/symbols/PolygonSymbol3D',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/symbols/PictureMarkerSymbol',
            'esri/symbols/SimpleLineSymbol',
            'esri/symbols/SimpleFillSymbol',
            'esri/symbols/PointSymbol3D',
            'esri/symbols/ObjectSymbol3DLayer',
            'esri/symbols/MeshSymbol3D',
            'esri/symbols/FillSymbol3DLayer',
            'esri/symbols/LineSymbol3D',
            'esri/symbols/PathSymbol3DLayer',
            'esri/symbols/TextSymbol',
            'esri/symbols/LabelSymbol3D',
            'esri/symbols/TextSymbol3DLayer',

            'esri/geometry/Geometry',
            'esri/geometry/Point',
            'esri/geometry/Extent',
            'esri/geometry/SpatialReference',
            'esri/geometry/geometryEngine',
            'esri/geometry/support/webMercatorUtils',

            'esri/tasks/QueryTask',
            'esri/tasks/support/Query',

            'esri/widgets/Search',
            'esri/widgets/ColorSlider',
            'esri/widgets/Legend',

            'dojo/promise/all',
            'dojo/on',
            'dojo/query',
            'dojo/domReady!'
        ], (
            esriConfig,
            Map,
            Graphic,
            Camera,
            WebScene,
            esriRequest,
            Color,
            SceneView,
            externalRenderers,
            FeatureLayer,
            TileLayer,
            GraphicsLayer,
            PointCloudLayer,
            SceneLayer,
            LabelClass,
            watchUtils,
            Collection,
            declare,
            lang,
            UniqueValueRenderer,
            ClassBreaksRenderer,
            SimpleRenderer,
            jsonUtils,
            PointCloudUniqueValueRenderer,
            PointCloudRGBRenderer,
            PointCloudStretchRenderer,
            PointCloudClassBreaksRenderer,
            colorRendererCreator,
            ExtrudeSymbol3DLayer,
            PolygonSymbol3D,
            SimpleMarkerSymbol,
            PictureMarkerSymbol,
            SimpleLineSymbol,
            SimpleFillSymbol,
            PointSymbol3D,
            ObjectSymbol3DLayer,
            MeshSymbol3D,
            FillSymbol3DLayer,
            LineSymbol3D,
            PathSymbol3DLayer,
            TextSymbol,
            LabelSymbol3D,
            TextSymbol3DLayer,
            Geometry,
            Point,
            Extent,
            SpatialReference,
            geometryEngine,
            webMercatorUtils,
            QueryTask,
            Query,
            Search,
            ColorSlider,
            Legend,
            all,
            on,
            query
        ) => {
            if (global.options.cors) {
                global.options.cors.forEach(elm => {
                    esriConfig.request.corsEnabledServers.push(elm)
                })
            }

            esriConfig.request.proxyUrl = global.options.proxy || ''

            constructors.Map = Map
            constructors.SceneView = SceneView
            constructors.WebScene = WebScene
            constructors.externalRenderers = externalRenderers

            constructors.layer.FeatureLayer = FeatureLayer
            constructors.layer.TileLayer = TileLayer
            constructors.layer.GraphicsLayer = GraphicsLayer
            constructors.layer.PointCloudLayer = PointCloudLayer
            constructors.layer.SceneLayer = SceneLayer
            constructors.layer.LabelClass = LabelClass

            constructors.utils.watchUtils = watchUtils
            constructors.utils.Search = Search
            constructors.utils.ColorSlider = ColorSlider
            constructors.utils.Legend = Legend
            constructors.utils.jsonUtils = jsonUtils
            constructors.utils.Extent = Extent
            constructors.utils.SpatialReference = SpatialReference
            constructors.utils.geometryEngine = geometryEngine
            constructors.utils.webMercatorUtils = webMercatorUtils
            constructors.utils.Camera = Camera
            constructors.utils.Graphic = Graphic
            constructors.utils.esriRequest = esriRequest
            constructors.utils.Color = Color
            constructors.utils.declare = declare
            constructors.utils.lang = lang
            constructors.utils.QueryTask = QueryTask
            constructors.utils.Query = Query

            constructors.renderer.UniqueValueRenderer = UniqueValueRenderer
            constructors.renderer.ClassBreaksRenderer = ClassBreaksRenderer
            constructors.renderer.ExtrudeSymbol3DLayer = ExtrudeSymbol3DLayer
            constructors.renderer.PolygonSymbol3D = PolygonSymbol3D
            constructors.renderer.SimpleRenderer = SimpleRenderer
            constructors.renderer.SimpleMarkerSymbol = SimpleMarkerSymbol
            constructors.renderer.PictureMarkerSymbol = PictureMarkerSymbol
            constructors.renderer.SimpleLineSymbol = SimpleLineSymbol
            constructors.renderer.SimpleFillSymbol = SimpleFillSymbol
            constructors.renderer.Point = Point
            constructors.renderer.PointSymbol3D = PointSymbol3D
            constructors.renderer.ObjectSymbol3DLayer = ObjectSymbol3DLayer
            constructors.renderer.MeshSymbol3D = MeshSymbol3D
            constructors.renderer.FillSymbol3DLayer = FillSymbol3DLayer
            constructors.renderer.LineSymbol3D = LineSymbol3D
            constructors.renderer.PathSymbol3DLayer = PathSymbol3DLayer
            constructors.renderer.TextSymbol = TextSymbol
            constructors.renderer.LabelSymbol3D = LabelSymbol3D
            constructors.renderer.TextSymbol3DLayer = TextSymbol3DLayer
            constructors.renderer.PointCloudUniqueValueRenderer = PointCloudUniqueValueRenderer
            constructors.renderer.PointCloudRGBRenderer = PointCloudRGBRenderer
            constructors.renderer.PointCloudStretchRenderer = PointCloudStretchRenderer
            constructors.renderer.PointCloudClassBreaksRenderer = PointCloudClassBreaksRenderer
            constructors.renderer.colorRendererCreator = colorRendererCreator

            constructors.dojo.on = on
            constructors.dojo.all = all
            constructors.dojo.query = query

            if (constructors.Map && constructors.SceneView) {
                logger.log(`All constructorss created!`)

                createMap(
                    constructors.Map,
                    global.options.basemap
                )
                .then(map => {
                    global.map = map
                    return global.map
                })
                .then(map => {
                    createView(
                        map,
                        constructors.SceneView,
                        global.options
                    ).then(view => {
                        global.view = view
                        resolve()
                    })
                })
            } else {
                logger.error(`Error during creating the necessary constructors... Try again.`)
                reject()
            }
        })
    } else {
        logger.fatal(`Fatal error! You need set some map options.`)
        reject()
    }
}

/**
 * Create map using ESRI Map constructor
 * @param  {Function} Map - ESRI Map constructor
 * @param  {String} basemap - The initial basemap
 * @return {Object} Global map object descriptor
 */
const createMap = (Map, basemap) => {
    logger.log(`Creating map...`)

    const map = new Map({
        basemap: basemap,
        ground: 'world-elevation'
    })

    return Promise.resolve(map)
}
