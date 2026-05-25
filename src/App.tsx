import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import {
  LeafletView,
  LoadingIndicator,
  MapLayerType,
  WebviewLeafletMessage,
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

const App: React.FC = () => {
  const [webViewContent, setWebViewContent] = useState<string | null>(null);
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

  if (!isWeb && !webViewContent) {
    return <LoadingIndicator />;
  }

  const buildMapsUrl = (lat: number, lng: number, label?: string) => {
    const encodedLabel = encodeURIComponent(label ?? "Pinned location");
    console.log("Building maps URL for:", { lat, lng, label, encodedLabel });
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
      mapMarkers={MARKERS}
      zoomControlStyle={ZOOM_CONTROL_STYLE}
      zoomInStyle={ZOOM_CONTROL_IN_STYLE}
      zoomOutStyle={ZOOM_CONTROL_OUT_STYLE}
      zoom={DEFAULT_ZOOM}
      doDebug={__DEV__}
      useMarkerClustering={true}
      zoomControl={true}
      attributionControl={true}
      mapShapes={MAP_SHAPES}
      style={{ marginTop: 10 }}
      onMessageReceived={onMessageReceived}
    />
  );
};

export default App;
