import { AnimationDirection, AnimationType, MapMarker } from "@carlossts/react-native-leaflet-platform";

// MARKERS OF CASCAVEL/CE
export const MARKERS: MapMarker[] = [
  {
    id: "1",
    position: { lat: -4.1248, lng: -38.2220 },
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
    autoClose:false,
  },
  {
    id: "2",
    position: { lat: -4.1528, lng: -38.2570 },
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
    autoClose:true,
  },
  {
    id: "3",
    position: { lat: -4.1200, lng: -38.2528 },
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
  onclick="(function(){
    var payload = {
      type: 'custom',
      event: 'OPEN_MAPS',
      payload: {
        mapCenterPosition: {
          lat: -4.1331481,
          lng: -38.2441773
        }
      },
      msg: 'São Francisco Square'
    };

    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(JSON.stringify(payload));
      return;
    }

    var label = encodeURIComponent(payload.msg || 'Pinned location');
    var url = 'https://www.google.com/maps?q=' +
      payload.payload.mapCenterPosition.lat + ',' +
      payload.payload.mapCenterPosition.lng + '(' + label + ')';

    window.open(url, '_blank', 'noopener,noreferrer');
  })()"
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