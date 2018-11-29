export const prefix = 'ArcEasy'

export const global = {
  map: {},
  view: {},
  options: {
    cdn: 'https://js.arcgis.com/4.3/',
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
    watcher: true,
    light: {
      cameraTracking: true
    },
    search: {
      enable: false,
      position: 'top-left',
      index: 1
    },
    cors: [],
    proxy: ''
  },
  loaded: false
}

export const constructors = {
  layer: {},
  map: {},
  container: {},
  view: {},
  utils: {},
  renderer: {},
  dojo: {}
}

export const templates = {
  renderers: [],
  symbols: []
}
