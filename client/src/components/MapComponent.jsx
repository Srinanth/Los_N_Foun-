import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent({ setLocation }) {
  const [position, setPosition] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLocation(e.latlng);
      },
    });

    return position ? (
      <Marker position={position} icon={DefaultIcon}>
        <Popup>Selected Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</Popup>
      </Marker>
    ) : null;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => console.log("Location access denied")
    );
  }, []);

  return (
    <MapContainer
      center={position || [20, 77]}
      zoom={position ? 13 : 5}
      style={{ height: "300px", width: "100%" }}
      className="border border-gray-300 rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}