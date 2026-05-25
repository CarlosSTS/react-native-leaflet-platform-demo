import { MapLayer } from "@carlossts/react-native-leaflet-platform";

export const DEFAULT_MAP_LAYERS: MapLayer[] = [
  {
    attribution: '&copy; <a href="#">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: "OpenStreetMap.Mapnik",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attributionPrefix: '<a href="#">Leaflet</a>',
    maxZoom: 19,
    minZoom: 3,
  },
  {
    attribution:
      '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
    baseLayerIsChecked: false,
    baseLayerName: "OpenTopoMap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attributionPrefix: '<a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
    minZoom: 3,
  },
  {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    baseLayerIsChecked: false,
    baseLayerName: "CartoDB.Positron",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attributionPrefix: '<a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    minZoom: 3,
  },
  {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    baseLayerIsChecked: false,
    baseLayerName: "CartoDB.DarkMatter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attributionPrefix: '<a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
    minZoom: 3,
  },
  {
    attribution:
      'Tiles &copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    baseLayerIsChecked: false,
    baseLayerName: "Esri.WorldImagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attributionPrefix: '<a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19,
    minZoom: 3,
  },
];