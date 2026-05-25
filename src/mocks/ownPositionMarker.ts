import { OWN_POSITION_MARKER_ID } from "@carlossts/react-native-leaflet-platform";
import { DEFAULT_LOCATION } from "./locations";

export const OWN_POSITION_MARKER = {
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