import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons in React/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored SVG icons for different risk levels
const createCustomMarker = (riskLevel) => {
  let color = '#22C55E'; // green
  if (riskLevel === 'CRITICAL') color = '#EF4444'; // red
  else if (riskLevel === 'HIGH') color = '#F97316'; // orange
  else if (riskLevel === 'MEDIUM') color = '#EAB308'; // yellow

  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="36px" height="36px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    html: svgTemplate,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32]
  });
};

// User Location Custom Icon (Blue Dot Pulse)
const userLocationIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-60"></div>
      <div class="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg"></div>
    </div>
  `,
  className: 'user-pulse-icon',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Component to dynamically fly map view to target coordinates
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ 
  hotspots = [], 
  selectedHotspot = null, 
  onSelectHotspot = () => {},
  selectedRoute = null,
  userLocation = null,
  showPins = true,
  showKde = true,
  showSpeedLimits = false,
  zoom = 13,
  center = [19.9975, 73.7898] // Nashik City Center
}) {

  // Resolve map center: prioritize selected hotspot, user location, or default center
  let mapCenter = center;
  if (selectedHotspot) {
    mapCenter = [selectedHotspot.lat, selectedHotspot.lng];
  } else if (userLocation) {
    mapCenter = [userLocation.latitude, userLocation.longitude];
  }

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} zoom={selectedHotspot ? 15 : zoom} />

        {/* User Location indicator */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userLocationIcon}>
            <Popup>
              <div className="text-xs font-semibold">
                📍 You are here<br />
                Speed: {userLocation.speed || 0} km/h
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected Route Polyline path */}
        {selectedRoute && selectedRoute.path && (
          <Polyline 
            positions={selectedRoute.path} 
            color={selectedRoute.color || '#3B82F6'} 
            weight={6} 
            opacity={0.8}
          />
        )}

        {/* Hotspot Pins */}
        {showPins && hotspots.map((spot) => (
          <Marker 
            key={spot.id} 
            position={[spot.lat, spot.lng]} 
            icon={createCustomMarker(spot.riskLevel)}
            eventHandlers={{
              click: () => onSelectHotspot(spot),
            }}
          >
            <Popup>
              <div className="text-xs">
                <p className="font-bold text-sm text-navy-900">{spot.name}</p>
                <p className="mt-1">Risk Score: <span className="font-bold">{spot.riskScore}</span> ({spot.riskLevel})</p>
                <p>Accidents: <span className="font-bold">{spot.accidentCount}</span></p>
                <button 
                  onClick={() => onSelectHotspot(spot)}
                  className="mt-2 text-blue-600 hover:underline font-semibold block"
                >
                  View details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* KDE Heatmap Layer (Simulated with semi-transparent circles) */}
        {showKde && hotspots.map((spot) => {
          let color = '#22C55E';
          if (spot.riskLevel === 'CRITICAL') color = '#EF4444';
          else if (spot.riskLevel === 'HIGH') color = '#F97316';
          else if (spot.riskLevel === 'MEDIUM') color = '#EAB308';

          return (
            <React.Fragment key={`kde-${spot.id}`}>
              {/* Outer faint glow */}
              <Circle
                center={[spot.lat, spot.lng]}
                radius={250}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.12,
                  color: 'transparent'
                }}
              />
              {/* Mid density glow */}
              <Circle
                center={[spot.lat, spot.lng]}
                radius={130}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.22,
                  color: 'transparent'
                }}
              />
              {/* Inner core */}
              <Circle
                center={[spot.lat, spot.lng]}
                radius={50}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.4,
                  color: 'transparent'
                }}
              />
            </React.Fragment>
          );
        })}

        {/* Speed Limit Indicators Overlay */}
        {showSpeedLimits && hotspots.map((spot) => {
          // Provide realistic limits per zone type
          const speedLimit = spot.riskLevel === 'CRITICAL' || spot.riskLevel === 'HIGH' ? 40 : 60;
          return (
            <Circle
              key={`speed-${spot.id}`}
              center={[spot.lat, spot.lng]}
              radius={70}
              pathOptions={{
                fillColor: '#FFFFFF',
                fillOpacity: 0.8,
                color: '#EF4444',
                weight: 2
              }}
            >
              <Popup>
                <div className="text-center font-bold text-xs text-red-600">
                  ⚠️ Speed Limit: {speedLimit} km/h
                </div>
              </Popup>
            </Circle>
          );
        })}

      </MapContainer>
    </div>
  );
}
