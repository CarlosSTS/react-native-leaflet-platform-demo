import { MapShape, MapShapeType } from "@carlossts/react-native-leaflet-platform";

export const MAP_SHAPES: MapShape[] = [
  {
    id: "sao-francisco-square-area",
    shapeType: MapShapeType.POLYGON,
    positions: [
      { lat: -4.1323, lng: -38.2448 },
      { lat: -4.1323, lng: -38.2438 },
      { lat: -4.1333, lng: -38.2438 },
      { lat: -4.1333, lng: -38.2448 },
    ],
    color: "#FF9800",
  },
  {
    id: "main-square-area",
    shapeType: MapShapeType.CIRCLE,
    positions: [{ lat: -4.1393855, lng: -38.2429761 }],
    radius: 80,
    color: "#4CAF50",
    center: {
      lat: -4.1393855,
      lng: -38.2429761,
    },
  },
  {
    id: "aguas-belas-area",
    shapeType: MapShapeType.CIRCLE,
    positions: [{ lat: -4.0553, lng: -38.1869 }],
    radius: 120,
    color: "#00BCD4",
    center: {
      lat: -4.0553,
      lng: -38.1869,
    },
  },
  {
    id: "cascavel-city-area",
    shapeType: MapShapeType.POLYGON,
    positions: [
      { lat: -4.1200, lng: -38.2500 },
      { lat: -4.1200, lng: -38.2300 },
      { lat: -4.1500, lng: -38.2300 },
      { lat: -4.1500, lng: -38.2500 },
    ],
    color: "#1e293b",
  },
  {
    id: "historic-core-area",
    shapeType: MapShapeType.RECTANGLE,
    bounds: [
      { lat: -4.1420, lng: -38.2470 },
      { lat: -4.1305, lng: -38.2360 },
    ],
    color: "#7c3aed",
  },
  {
    id: "bus-station-marker",
    shapeType: MapShapeType.CIRCLE_MARKER,
    center: { lat: -4.1295, lng: -38.2485 },
    radius: 12,
    color: "#f43f5e",
  },
];