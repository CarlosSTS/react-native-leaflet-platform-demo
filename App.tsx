import React, { useEffect, useState } from "react";
import {
  AnimationDirection,
  AnimationType,
  LeafletView,
  LoadingIndicator,
  MapLayer,
  MapMarker,
  MapShape,
  MapShapeType,
  OWN_POSITION_MARKER_ID,
  WebviewLeafletMessage,
  calculateDistance,
  checkLocationPermission,
  getOSRMRouteRaw,
} from "@carlossts/react-native-leaflet-platform";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

// Real coordinates of Cascavel/CE center
const DEFAULT_LOCATION = {
  latitude: -4.1337,
  longitude: -38.2412,
};

const DEFAULT_MAP_CENTER = {
  lat: DEFAULT_LOCATION.latitude,
  lng: DEFAULT_LOCATION.longitude,
};

const DEFAULT_ZOOM = 11;

const DEFAULT_MAP_LAYERS: MapLayer[] = [
  {
    attribution: '&copy; <a href="#">OpenStreetMap</a> contributors',
    baseLayerIsChecked: true,
    baseLayerName: "OpenStreetMap.Mapnik",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attributionPrefix: '<a href="#">Leaflet</a>',
    maxZoom: 19,
    minZoom: 3,
  },
];

// MARKERS OF CASCAVEL/CE
const MARKERS: MapMarker[] = [
  {
    id: "1",
    position: { lat: -4.0553, lng: -38.1869 },
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0HFyPaHG8Sej123no8Nl9ehr3Erf-Xf9VJw&s",
    size: [40, 40],
    title: "ÁGUAS BELAS BEACH",
    description: "Beach with natural pools",
    animation: {
      type: AnimationType.WAGGLE,
      duration: 4,
      direction: AnimationDirection.ALTERNATE,
      iterationCount: "infinite",
    },
    popupOffset: [-5, -36],
    iconStyle: `
      border-radius: 50%;
      border: 3px solid #00BCD4;
      background: white;
    `,
    titleStyle: "font-size:12px; font-weight:700;",
    closeButton: true,
    openPopupOnAdd: true,
  },
  {
    id: "2",
    position: { lat: -4.1393855, lng: -38.2429761 },
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZOu743ybl0D1o_HU-8bblVH4e-VVtrnD_xQ&s",
    size: [48, 48],
    title: "Main Square",
    description:
      "Community center with leisure, events and wooded area in the heart of the city.",
    animation: {
      type: AnimationType.PULSE,
      duration: 2,
      iterationCount: "infinite",
    },
    iconStyle: `
      border-radius: 12px;
      border: 3px solid #4CAF50;
      background: white;
      box-shadow: 0 6px 14px rgba(0,0,0,0.35);
    `,
    tooltipStyle: `
      background: #1e293b;
      color: #ffffff;
      border-radius: 14px;
      padding: 12px 14px;
      font-family: system-ui;
      box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    `,
    tooltipTipStyle: `
      background: #1e293b;
    `,
    titleStyle: `
      font-size: 14px;
      font-weight: 800;
      color: #4ade80;
    `,
    descriptionStyle: `
      font-size: 12px;
      color: rgba(255,255,255,0.85);
      line-height: 16px;
    `,
    popupOffset: [-5, -40],
    popupMaxWidth: 260,
    closeButton: false,
    openPopupOnAdd: true,
  },
  {
    id: "3",
    position: { lat: -4.1331481, lng: -38.2441773 },
    icon: "https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&cs=tinysrgb&w=200",
    size: [48, 48],
    title: "São Francisco Square",
    description: `
<img 
  src="https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?auto=compress&w=400"
  style="width:100%; border-radius:10px; margin-bottom:6px;"
/>

<b>São Francisco Square</b><br/>

<span style="font-size:12px;">
Leisure and community space
</span>

<br/><br/>

<button 
  onclick="window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'custom',
    event: 'OPEN_MAPS',
    payload: {
      mapCenterPosition: {
        lat: -4.1331481,
        lng: -38.2441773
      }
    },
    msg: 'São Francisco Square'
  }))"
  style="
    width:100%;
    background:#2563eb;
    color:white;
    border:none;
    padding:8px;
    border-radius:8px;
    font-weight:bold;
    cursor:pointer;
  "
>
  Open in Google Maps
</button>
`,
    animation: {
      type: AnimationType.FADE,
      duration: 2,
      iterationCount: "infinite",
    },
    iconStyle: `
    border-radius: 12px;
    border: 3px solid #FF9800;
    background: white;
    box-shadow: 0 6px 14px rgba(0,0,0,0.35);
  `,
    tooltipStyle: `
    background: #1e293b;
    color: #ffffff;
    border-radius: 14px;
    padding: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
  `,
    tooltipTipStyle: `
    background: #1e293b;
  `,
    titleStyle: `
    font-size: 14px;
    font-weight: 800;
    color: #fbbf24;
  `,
    descriptionStyle: `
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    margin-top: 4px;
  `,
    popupOffset: [-5, -40],
    popupMaxWidth: 260,
    closeButton: true,
  }
];

const ROUTE_START_MARKER_ID = "2";
const ROUTE_END_MARKER_ID = "1";
const ROUTE_SHAPE_ID = "route-to-aguas-belas";

const ROUTE_START =
  MARKERS.find((marker) => marker.id === ROUTE_START_MARKER_ID)?.position ?? {
    lat: DEFAULT_LOCATION.latitude,
    lng: DEFAULT_LOCATION.longitude,
  };

const ROUTE_END =
  MARKERS.find((marker) => marker.id === ROUTE_END_MARKER_ID)?.position ?? {
    lat: DEFAULT_LOCATION.latitude,
    lng: DEFAULT_LOCATION.longitude,
  };

const BASE_SHAPES: MapShape[] = [
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

type MapSettings = {
  doDebug: boolean;
  useMarkerClustering: boolean;
  zoomControl: boolean;
  attributionControl: boolean;
};

const DEFAULT_MAP_SETTINGS: MapSettings = {
  doDebug: false,
  useMarkerClustering: true,
  zoomControl: true,
  attributionControl: true,
};

const MAP_SETTING_ITEMS: Array<{
  key: keyof MapSettings;
  label: string;
  hint: string;
}> = [
    {
      key: "useMarkerClustering",
      label: "useMarkerClustering",
      hint: "Groups nearby markers to reduce visual clutter.",
    },
    {
      key: "doDebug",
      label: "doDebug",
      hint: "Displays map debug logs.",
    },
    {
      key: "zoomControl",
      label: "zoomControl",
      hint: "Shows zoom controls.",
    },
    {
      key: "attributionControl",
      label: "attributionControl",
      hint: "Shows map attribution.",
    },
  ];

const App: React.FC = () => {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(MARKERS);
  const [routeShape, setRouteShape] = useState<MapShape | null>(null);
  const [mapSettings, setMapSettings] =
    useState<MapSettings>(DEFAULT_MAP_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_MAP_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  useEffect(() => {
    let isMounted = true;

    const loadRoute = async () => {
      try {
        const directDistanceM = calculateDistance(
          ROUTE_START.lat,
          ROUTE_START.lng,
          ROUTE_END.lat,
          ROUTE_END.lng,
        );
        const response = await getOSRMRouteRaw(ROUTE_START, ROUTE_END);
        const route = response.routes[0];
        const routePositions = route.geometry.coordinates.map(([lng, lat]) => ({
          lat,
          lng,
        }));

        if (!routePositions.length || !isMounted) {
          return;
        }

        const routeShape: MapShape = {
          id: ROUTE_SHAPE_ID,
          shapeType: MapShapeType.POLYLINE,
          positions: routePositions,
          color: "#ef4444",
        };

        const directKm = (directDistanceM / 1000).toFixed(2);
        const routeKm = (route.distance / 1000).toFixed(2);
        const routeMin = Math.round(route.duration / 60);

        const routeSummary = `
      <br/><br/>
      <b>Route Summary</b><br/>
      Straight line: ${directKm} km<br/>
      Via roads (estimated): ${routeKm} km (${routeMin} min)
      `;

        setRouteShape(routeShape);
        setMapMarkers(() =>
          MARKERS.map((marker) =>
            marker.id === ROUTE_START_MARKER_ID
              ? {
                ...marker,
                description: `${marker.description ?? ""}${routeSummary}`,
              }
              : marker,
          ),
        );
      } catch (error) {
        console.warn("Unable to load route", error);
      }
    };

    loadRoute();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const checkLocation = async () => {
      const result = await checkLocationPermission({
        showAlert: true,
        requestBackground: false,
        title: "Location Permission Required",
        message:
          "To show your location on the map, we need access to your location. Please grant permission to continue.",
        confirmText: "Grant Permission",
      });
      console.log("Location permission granted?", result);
    };
    checkLocation();
  }, []);

  const formatCoord = (value: number) => value.toFixed(5);

  const buildMapsUrl = (lat: number, lng: number, label?: string) => {
    const encodedLabel = encodeURIComponent(label ?? "Pinned location");

    if (Platform.OS === "web") {
      return `https://www.google.com/maps?q=${lat},${lng}(${encodedLabel})`;
    }

    return `geo:0,0?q=${lat},${lng}(${encodedLabel})`;
  };

  const onMessageReceived = (message: WebviewLeafletMessage) => {
    if (message.event === "OPEN_MAPS" && message.payload?.mapCenterPosition) {
      const { lat, lng } = message.payload.mapCenterPosition;
      const url = buildMapsUrl(lat, lng, message.msg);
      Linking.openURL(url);
      return;
    }

    if (
      (message.event === "onMoveEnd" || message.event === "onZoomEnd") &&
      message.payload
    ) {
      if (message.payload.mapCenterPosition) {
        setMapCenter(message.payload.mapCenterPosition);
      }
      if (typeof message.payload.zoom === "number") {
        setMapZoom(message.payload.zoom);
      }
    }
  };
  const toggleSetting = (key: keyof MapSettings) => {
    setMapSettings((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const visibleShapes: MapShape[] = [...BASE_SHAPES];

  if (routeShape) {
    visibleShapes.push(routeShape);
  }

  const visibleMarkers = mapMarkers;

  const ownPositionMarker = {
    position: {
      lat: DEFAULT_LOCATION.latitude,
      lng: DEFAULT_LOCATION.longitude,
    },
    icon: "https://avatars.githubusercontent.com/u/63306370?v=4",
    id: OWN_POSITION_MARKER_ID,
    size: [60, 60] as [number, number],
    title: "My Location",
    iconStyle:
      "border-style: solid; border-width: 1.6px; border-color: #FFFFFF; border-radius: 50%; box-shadow: 0 0 0 40px #0037FF2E;",
    titleStyle: "font-size:12px; font-weight:700;",
    description:
      "This is your current location. Move around to explore the tourist attractions of Cascavel/CE!",
  };

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (isWeb) return;

    let isMounted = true;

    const loadHtml = async () => {
      try {
        const { Asset } = await import('expo-asset');
        const { File } = await import('expo-file-system');

        const path = require('./assets/leaflet.html');
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await new File(asset.localUri!).text();

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        console.error('Error loading HTML:', error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, [isWeb]);

  if (!isWeb && !webViewContent) {
    return (
      <LoadingIndicator />
    );
  }

  return (
    <View style={styles.container}>
      <LeafletView
        {...(!isWeb && webViewContent
          ? { source: { html: webViewContent } }
          : {})}
        mapLayers={DEFAULT_MAP_LAYERS}
        mapShapes={visibleShapes}
        mapCenterPosition={DEFAULT_MAP_CENTER}
        zoomControlStyle={`
  margin-top: 40px;
  margin-left: 20px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
`}
        zoomInStyle={`
  background: transparent;
  color: #ffffff;
  border-bottom: 1px solid #334155;
  font-size: 20px;
  padding: 4px 0;
`}
        zoomOutStyle={`
  background: transparent;
  color: #ffffff;
  font-size: 20px;
  padding: 4px 0;
`}
        zoom={DEFAULT_ZOOM}
        mapMarkers={visibleMarkers}
        ownPositionMarker={ownPositionMarker}
        doDebug={mapSettings.doDebug}
        useMarkerClustering={mapSettings.useMarkerClustering}
        zoomControl={mapSettings.zoomControl}
        attributionControl={mapSettings.attributionControl}
        onMessageReceived={onMessageReceived}

      />

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Map Status</Text>
        <Text style={styles.statusText}>
          Center: {formatCoord(mapCenter.lat)}, {formatCoord(mapCenter.lng)}
        </Text>
        <Text style={styles.statusText}>Zoom: {mapZoom}</Text>
      </View>

      <Pressable
        style={styles.settingsButton}
        onPress={() => setIsSettingsOpen(true)}
      >
        <Text style={styles.settingsButtonText}>Map Settings</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={isSettingsOpen}
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Map Settings</Text>
            <Text style={styles.modalSubtitle}>
              Adjust boolean props in real time.
            </Text>

            <ScrollView
              contentContainerStyle={styles.settingsList}
              showsVerticalScrollIndicator={false}
            >
              {MAP_SETTING_ITEMS.map((item) => (
                <View key={item.key} style={styles.toggleRow}>
                  <View style={styles.toggleText}>
                    <Text style={styles.toggleLabel}>{item.label}</Text>
                    <Text style={styles.toggleHint}>{item.hint}</Text>
                  </View>
                  <Switch
                    value={mapSettings[item.key]}
                    onValueChange={() => toggleSetting(item.key)}
                    thumbColor={mapSettings[item.key] ? "#38bdf8" : "#94a3b8"}
                    trackColor={{ false: "#1f2937", true: "#0ea5e9" }}
                  />
                </View>
              ))}
            </ScrollView>

            <Pressable
              style={styles.closeButton}
              onPress={() => setIsSettingsOpen(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1120",
  },
  settingsButton: {
    position: "absolute",
    top: 44,
    right: 16,
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  settingsButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2, 6, 23, 0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#0f172a",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 18,
    maxHeight: "85%",
  },
  modalTitle: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  modalSubtitle: {
    color: "#94a3b8",
    fontSize: 13,
    marginBottom: 12,
  },
  settingsList: {
    gap: 12,
    paddingBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  toggleText: {
    flex: 1,
    paddingRight: 12,
  },
  toggleLabel: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "700",
  },
  toggleHint: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: "#38bdf8",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#0b1120",
    fontWeight: "800",
    fontSize: 14,
  },
  statusCard: {
    position: "absolute",
    left: 16,
    bottom: 16,
    backgroundColor: "#0f172a",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
    padding: 12,
    width: 220,
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  statusTitle: {
    color: "#e2e8f0",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statusText: {
    color: "#cbd5f5",
    fontSize: 11,
    marginBottom: 4,
  },
});

export default App;
