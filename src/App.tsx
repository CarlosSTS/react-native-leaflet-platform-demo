import React, { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";
import {
  LeafletView,
  LoadingIndicator,
  MapMarker,
  MapShape,
  MapShapeType,
  WebviewLeafletMessage,
  calculateDistance,
  checkLocationPermission,
  getOSRMRouteRaw
} from "@carlossts/react-native-leaflet-platform";
import { DEFAULT_LOCATION } from "./mocks/locations";
import { MARKERS } from "./mocks/markers";
import { OWN_POSITION_MARKER } from "./mocks/ownPositionMarker";
import { DEFAULT_MAP_LAYERS } from "./mocks/mapLayers";
import {
  ZOOM_CONTROL_STYLE,
  ZOOM_CONTROL_OUT_STYLE,
  ZOOM_CONTROL_IN_STYLE,
  DEFAULT_ZOOM,
} from "./mocks/zoom";
import { MAP_SHAPES } from "./mocks/mapShapes";

const ROUTE_SHAPE_ID = "route-to-beach";

const buildRouteSummary = (directKm: number, routeKm: number, routeMin: number) => `
<br/><br/>
<b>Route Summary</b><br/>
Straight line: ${directKm.toFixed(2)} km<br/>
Via roads (estimated): ${routeKm.toFixed(2)} km (${routeMin} min)
`;

const App: React.FC = () => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>(MARKERS);
  const [mapShapes, setMapShapes] = useState<MapShape[]>(MAP_SHAPES);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    if (isWeb) return;

    let isMounted = true;

    const loadHtml = async () => {
      try {
        const { Asset } = await import("expo-asset");
        const { File } = await import("expo-file-system");

        const path = require("../assets/leaflet.html");
        const asset = Asset.fromModule(path);
        await asset.downloadAsync();
        const htmlContent = await new File(asset.localUri!).text();

        if (isMounted) {
          setWebViewContent(htmlContent);
        }
      } catch (error) {
        console.error("Error loading HTML:", error);
      }
    };

    loadHtml();

    return () => {
      isMounted = false;
    };
  }, [isWeb]);

  const buildMapsUrl = (lat: number, lng: number, label?: string) => {
    const encodedLabel = encodeURIComponent(label ?? "Pinned location");
    if (Platform.OS === "web") {
      return `https://www.google.com/maps?q=${lat},${lng}(${encodedLabel})`;
    }
    return `geo:0,0?q=${lat},${lng}(${encodedLabel})`;
  };

  useEffect(() => {
    let isMounted = true;

    const runExamples = async () => {
      const start = OWN_POSITION_MARKER.position;
      const beachMarker = MARKERS.find((marker) => marker.id === "1");
      const end = beachMarker?.position ?? {
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      };

      const directDistanceM = calculateDistance(
        start.lat,
        start.lng,
        end.lat,
        end.lng,
      );
      const directKm = directDistanceM / 1000;

      const ensurePermission = async () => {
        try {
          await checkLocationPermission({
            showAlert: true,
            requestBackground: false,
            title: "Location Permission Required",
            message:
              "To show your location on the map, we need access to your location. Please grant permission to continue.",
            confirmText: "Grant Permission",
          });
        } catch (error) {
          console.warn("Location permission check failed", error);
        }
      };

      const fetchRoute = async () => {
        try {
          const response = await getOSRMRouteRaw(start, end);
          const route = response.routes?.[0];
          if (!route) return null;

          return {
            km: route.distance / 1000,
            min: Math.round(route.duration / 60),
            positions:
              route.geometry?.coordinates?.map(([lng, lat]: [number, number]) => ({
                lat,
                lng,
              })) ?? [],
          };
        } catch (error) {
          console.warn("OSRM route failed, using mock route", error);
          return {
            km: directKm,
            min: Math.max(1, Math.round((directKm / 40) * 60)),
            positions: [start, end],
          };
        }
      };

      await ensurePermission();
      const routeData = await fetchRoute();

      if (!routeData || !isMounted) {
        return;
      }

      if (routeData.positions.length) {
        const routeShape: MapShape = {
          id: ROUTE_SHAPE_ID,
          shapeType: MapShapeType.POLYLINE,
          positions: routeData.positions,
          color: "#ef4444",
        };
        setMapShapes((previous) => [
          ...previous.filter((shape) => shape.id !== ROUTE_SHAPE_ID),
          routeShape,
        ]);
      }

      const routeSummary = buildRouteSummary(directKm, routeData.km, routeData.min);
      if (beachMarker?.id) {
        setMapMarkers((previous) =>
          previous.map((marker) =>
            marker.id === beachMarker.id
              ? {
                  ...marker,
                  description: `${marker.description ?? ""}${routeSummary}`,
                }
              : marker,
          ),
        );
      }
    };

    runExamples();

    return () => {
      isMounted = false;
    };
  }, [isWeb]);

  if (!isWeb && !webViewContent) {
    return <LoadingIndicator />;
  }

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
        console.log(
          "New map center position:",
          message.payload.mapCenterPosition,
        );
      }
      if (typeof message.payload.zoom === "number") {
        console.log("New zoom level:", message.payload.zoom);
      }
    }
  };

  return (
    <LeafletView
      source={!isWeb && webViewContent
        ? { html: webViewContent }
        : undefined}
      mapCenterPosition={{
        lat: DEFAULT_LOCATION.latitude,
        lng: DEFAULT_LOCATION.longitude,
      }}
      mapLayers={DEFAULT_MAP_LAYERS}
      ownPositionMarker={OWN_POSITION_MARKER}
      mapMarkers={mapMarkers}
      zoomControlStyle={ZOOM_CONTROL_STYLE}
      zoomInStyle={ZOOM_CONTROL_IN_STYLE}
      zoomOutStyle={ZOOM_CONTROL_OUT_STYLE}
      zoom={DEFAULT_ZOOM}
      doDebug={__DEV__}
      useMarkerClustering={true}
      zoomControl={true}
      attributionControl={true}
      mapShapes={mapShapes}
      style={{ marginTop: 10 }}
      onMessageReceived={onMessageReceived}
    />
  );
};

export default App;
