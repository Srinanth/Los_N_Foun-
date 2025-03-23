import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebaseConfig";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { useNavigate } from "react-router-dom";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [reports, setReports] = useState([]);
  const [senderEmail, setSenderEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const auth = getAuth(app);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSenderEmail(user.email);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setUserLocation([latitude, longitude]);
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error fetching location:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const fetchItems = async () => {
    if (!selectedLocation) {
      alert("Please select a location on the map first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("https://los-n-found.onrender.com/api/items", {
        params: {
          latitude: selectedLocation[0],
          longitude: selectedLocation[1],
          radius: 20,
        },
      });

      if (response.data && response.data.items) {
        setReports(response.data.items);
      } else {
        setReports([]);
      }
    } catch (error) {
      setError("Failed to fetch items");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (ownerUid, itemDetails, title) => {
    try {
      const response = await axios.post("https://los-n-found.onrender.com/api/send-email", {
        ownerUid,
        senderEmail: auth.currentUser.email,
        itemDetails,
        title,
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]);
      },
    });

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={DefaultIcon}>
        <Popup>Selected Location</Popup>
      </Marker>
    ) : null;
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-grow relative">
        {position && (
          <MapContainer center={position} zoom={13} className="h-full w-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {userLocation && (
              <Marker position={userLocation} icon={DefaultIcon}>
                <Popup>You are here</Popup>
              </Marker>
            )}
            <LocationMarker />
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <Marker
                  key={index}
                  position={[report.location.lat, report.location.lng]}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{report.description}</h3>
                      <p>Type: {report.type}</p>
                      {report.userId && (
                        <button
                          onClick={() => handleSendEmail(report.userId, report.description, report.type)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                        >
                          Email Owner
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))
            ) : (
              <p className="absolute top-2 left-2 bg-white p-2 text-gray-700 shadow-md">
                No items found in this area
              </p>
            )}
          </MapContainer>
        )}
      </div>

      <div className="p-4 bg-white shadow-md flex flex-col items-center">
        {selectedLocation && (
          <p className="mb-2 text-gray-700">
            Selected Location: {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        )}
        <button
          onClick={fetchItems}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search Locality"}
        </button>
      </div>
      <button
        onClick={() => navigate("/Home")}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default MapComponent;