# React Native Leaflet Platform Demo

Cross-platform demo (Android/iOS/Web) built with Expo using
[@carlossts/react-native-leaflet-platform](https://github.com/CarlosSTS/react-native-leaflet-platform).
This project enhances the official example with extra map elements and UI polish.

## Map Features

- Custom markers with icons, animations, and HTML tooltips/popups
- Popup button that opens the location in Google Maps
- OSRM route between points with distance/time summary
- Shapes: polygons, circles, rectangles, and circle markers
- Status panel showing current center and zoom
- Own-position marker with custom styling
- Custom zoom control styling
- Settings toggles for library props only (clustering, zoom, attribution, debug)

## Screenshots

<table>
	<tr>
		<td align="center">
			<img src="https://res.cloudinary.com/dbw8igay3/image/upload/ios_s7wm58.png" alt="iOS Screenshot" width="350" />
		</td>
		<td align="center">
			<img src="https://res.cloudinary.com/dbw8igay3/image/upload/android_bdwkku.png" alt="Android Screenshot" width="440" />
		</td>
		 <td align="center">
			<img src="https://res.cloudinary.com/dbw8igay3/image/upload/5628890f-65e7-4888-9ea1-9ad9a6d84fd8.png" alt="Web Screenshot" width="1340" />
		</td>
	</tr>
</table>

## Getting Started

Install dependencies:

```sh
npm install
```

### Android

```sh
npm run android
```

### iOS (macOS)

```sh
npm run ios
```

### Web (Expo Web)

```sh
npm run copy-leaflet-html-web
npm run web
```

The `copy-leaflet-html-web` script copies `leaflet.html` into the public/
folder (required for rendering the map on web). Run it again if the HTML
asset changes.

## Scripts

- `npm run start` - start Expo in interactive mode
- `npm run android` - open on Android
- `npm run ios` - open on iOS
- `npm run web` - open in the browser
- `npm run copy-leaflet-html-web` - copy `leaflet.html` for web

## Project Structure

- Main app: [App.tsx](App.tsx)
- Leaflet HTML for mobile: [assets/leaflet.html](assets/leaflet.html)
- Leaflet HTML for web: [public/leaflet.html](public/leaflet.html)

## Notes

- Location permission is optional here. The demo shows the own-position marker
  with fixed coordinates; real location can be wired later if needed.
- The route uses public OSRM and requires an internet connection.

## Credits

Built with [Leaflet.js](https://leafletjs.com/) and
[@carlossts/react-native-leaflet-platform](https://github.com/CarlosSTS/react-native-leaflet-platform).
