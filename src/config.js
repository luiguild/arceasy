export const prefix = '[ArcEasy]'

export const global = {
    map: '',
    view: '',
    options: {
        element: '',
        scale: 25000000,
        center: {
            longitude: -13.78,
            latitude: -52.17
        },
        basemap: 'streets',
        stars: true,
        atmosphere: {
            enable: true,
            quality: 'low'
        },
        search: {
            enable: false,
            position: 'top-left',
            index: 1
        },
        cors: '',
        proxy: ''
    },
    loaded: false
}

export const constructors = {
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
