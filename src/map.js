import * as esriLoader from 'esri-loader'
import * as logger from './logger'
import { createView } from './view'

const global = {
    map: '',
    view: ''
}
const constructors = {
    layer: {
        FeatureLayer: '',
        TileLayer: ''
    },
    map: '',
    container: '',
    view: '',
    utils: {
        watchUtils: '',
        Search: '',
        jsonUtils: '',
        Extent: ''
    },
    renderer: {
        UniqueValueRenderer: '',
        ClassBreaksRenderer: '',
        ExtrudeSymbol3DLayer: '',
        PolygonSymbol3D: '',
        SimpleRenderer: '',
        SimpleMarkerSymbol: '',
        PictureMarkerSymbol: '',
        SimpleLineSymbol: '',
        SimpleFillSymbol: ''
    }
}

/**
 * [start description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const start = options => {
    // has the ArcGIS API been added to the page?
    if (!esriLoader.isLoaded()) {
        // no, lazy load it the ArcGIS API before using its classes
        esriLoader.bootstrap((err) => {
            if (err) {
                logger.error(err)
            }
            // once it's loaded, create the map
            logger.log('Waiting ESRI servers...')
            dojoLoader(options)
        }, {
            // use a specific version instead of latest 4.x
            // url: 'https://js.arcgis.com/4.3/'
            url: 'http://localhost/arcgis_js_api/library/4.3/4.3/init.js'
        })
    } else {
        // ArcGIS API is already loaded, just create the map
        logger.log('Waiting ESRI servers...')
        dojoLoader(options)
    }
}

/**
 * [dojoLoader description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
const dojoLoader = options => {
    esriLoader.dojoRequire([
        'esri/config',
        'esri/Map',
        'esri/geometry/Geometry',
        'esri/Camera',
        'esri/geometry/Extent',
        'esri/views/SceneView',
        'esri/layers/FeatureLayer',
        'esri/layers/TileLayer',
        'esri/layers/GraphicsLayer',
        'esri/core/watchUtils',
        'esri/core/Collection',
        'esri/renderers/UniqueValueRenderer',
        'esri/renderers/ClassBreaksRenderer',
        'esri/renderers/SimpleRenderer',
        'esri/symbols/ExtrudeSymbol3DLayer',
        'esri/symbols/PolygonSymbol3D',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/symbols/PictureMarkerSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/symbols/SimpleFillSymbol',
        'esri/Graphic',
        'esri/geometry/Point',
        'esri/symbols/PointSymbol3D',
        'esri/symbols/ObjectSymbol3DLayer',
        'esri/widgets/Search',
        'esri/renderers/support/jsonUtils',
        'dojo/on',
        'dojo/domReady!'
    ], (
        esriConfig,
        Map,
        Geometry,
        Camera,
        Extent,
        SceneView,
        FeatureLayer,
        TileLayer,
        GraphicsLayer,
        watchUtils,
        Collection,
        UniqueValueRenderer,
        ClassBreaksRenderer,
        SimpleRenderer,
        ExtrudeSymbol3DLayer,
        PolygonSymbol3D,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
        SimpleLineSymbol,
        SimpleFillSymbol,
        Graphic,
        Point,
        PointSymbol3D,
        ObjectSymbol3DLayer,
        Search,
        jsonUtils,
        on
    ) => {
        esriConfig.request.corsEnabledServers.push(
            'http://localhost',
            'http://45.33.83.153'
        )
        esriConfig.request.proxyUrl = 'http://localhost'

        constructors.Map = Map
        constructors.SceneView = SceneView

        constructors.layer.FeatureLayer = FeatureLayer
        constructors.layer.TileLayer = TileLayer
        constructors.layer.GraphicsLayer = GraphicsLayer

        constructors.utils.watchUtils = watchUtils
        constructors.utils.Search = Search
        constructors.utils.jsonUtils = jsonUtils
        constructors.utils.Extent = Extent
        constructors.utils.Camera = Camera

        constructors.renderer.UniqueValueRenderer = UniqueValueRenderer
        constructors.renderer.ClassBreaksRenderer = ClassBreaksRenderer
        constructors.renderer.ExtrudeSymbol3DLayer = ExtrudeSymbol3DLayer
        constructors.renderer.PolygonSymbol3D = PolygonSymbol3D
        constructors.renderer.SimpleRenderer = SimpleRenderer
        constructors.renderer.SimpleMarkerSymbol = SimpleMarkerSymbol
        constructors.renderer.PictureMarkerSymbol = PictureMarkerSymbol
        constructors.renderer.SimpleLineSymbol = SimpleLineSymbol
        constructors.renderer.SimpleFillSymbol = SimpleFillSymbol
        constructors.renderer.Graphic = Graphic
        constructors.renderer.Point = Point
        constructors.renderer.PointSymbol3D = PointSymbol3D
        constructors.renderer.ObjectSymbol3DLayer = ObjectSymbol3DLayer

        if (constructors.Map && constructors.SceneView) {
            logger.log('All constructorss created!')

            global.map = createMap(constructors.Map)

            global.view = createView(
                global.map,
                constructors.SceneView,
                options
            )
        } else {
            logger.error('Error during creating constructorss... Try again.')
        }
    })
}

/**
 * [createMap description]
 * @param  {[type]} Map [description]
 * @return {[type]}     [description]
 */
const createMap = Map => {
    logger.log('Creating map...')

    const map = new Map({
        basemap: 'dark-gray',
        ground: 'world-elevation',
        layers: []
    })

    return map
}

export {
    constructors,
    global,
    start
}
