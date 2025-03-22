import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";

export default function MapComponent({ setLocation }) {
  const [position, setPosition] = useState(null);

  // Function to handle user's click on the map
  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        setLocation(e.latlng); // Send selected location to parent component
      },
    });

    return position ? (
      <Marker position={position}>
        <Popup>Selected Location: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</Popup>
      </Marker>
    ) : null;
  }

  // Get user's current location on first load
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
      center={position || [20, 77]} // Default to India if no location found
      zoom={position ? 13 : 5}
      style={{ height: "300px", width: "100%" }}
      className="border border-gray-300 rounded"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}
