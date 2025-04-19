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
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { FaArrowLeft, FaSearch, FaEnvelope, FaMap, FaSatellite, FaLocationArrow } from "react-icons/fa";

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
  const [emailLoading, setEmailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapView, setMapView] = useState("normal");
  const [mapInstance, setMapInstance] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

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
          setUserLocation([51.505, -0.09]);
          setPosition([51.505, -0.09]);
        },
        { enableHighAccuracy: true }
      );
    }
  }, [auth]);

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
    setEmailLoading(true);
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
    } finally {
      setEmailLoading(false);
    }
  };

  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        setSelectedLocation([e.latlng.lat, e.latlng.lng]);
      },
    });

    useEffect(() => {
      if (map) {
        setMapInstance(map);
      }
    }, [map]);

    return selectedLocation ? (
      <Marker position={selectedLocation} icon={DefaultIcon}>
        <Popup className={isDarkMode ? "leaflet-popup-content-wrapper-dark" : ""}>
          <span className={isDarkMode ? "text-white" : "text-gray-800"}>Selected Location</span>
        </Popup>
      </Marker>
    ) : null;
  };

  const toggleMapView = () => {
    setMapView(prev => prev === "normal" ? "satellite" : "normal");
  };

  const centerToUserLocation = () => {
    if (mapInstance && userLocation) {
      mapInstance.flyTo(userLocation, 15);
    }
  };

  const darkClass = isDarkMode ? "dark" : "";

  return (
    <div className={`${darkClass} min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} flex flex-col`}>
      <div className={`${isDarkMode ? "bg-gray-800 text-white shadow-md" : "bg-white shadow-sm text-gray-800"} p-4 flex justify-between items-center`}>
        <h1 className="text-xl font-bold flex items-center">
          <FaSearch className="mr-2 text-blue-600" />
          Map Search
        </h1>
        <button
          onClick={() => navigate("/Home")}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          <FaArrowLeft className="mr-1" />
          Back
        </button>
      </div>

      <div className="flex-grow relative" style={{ height: "60vh" }}>
        {position ? (
          <MapContainer
            center={position}
            zoom={13}
            className="h-full w-full"
            style={{ zIndex: 0 }}
            whenCreated={(map) => setMapInstance(map)}
          >
            {mapView === "normal" ? (
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            ) : (
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              />
            )}

            {userLocation && (
              <Marker position={userLocation} icon={DefaultIcon}>
                <Popup className={isDarkMode ? "leaflet-popup-content-wrapper-dark" : ""}>
                  <span className={isDarkMode ? "text-white" : "text-gray-800"}>You are here</span>
                </Popup>
              </Marker>
            )}
            <LocationMarker />
            {reports.map((report, index) => (
              <Marker
                key={index}
                position={[report.location.lat, report.location.lng]}
                icon={DefaultIcon}
              >
                <Popup className={`custom-popup ${isDarkMode ? "leaflet-popup-content-wrapper-dark" : ""}`}>
                  <div className="p-2">
                    <h3 className={`${isDarkMode ? "text-white" : "text-gray-800"} font-bold`}>{report.description}</h3>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Type: {report.type}</p>
                    {report.userId && (
                      <button
                        onClick={() => handleSendEmail(report.userId, report.description, report.type)}
                        className={`mt-2 w-full ${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} px-3 py-1 rounded-md transition flex items-center justify-center`}
                        disabled={emailLoading}
                      >
                        {emailLoading ? (
                          <>
                            <CircularProgress size={16} color="inherit" className="mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaEnvelope className="mr-1" />
                            Contact Owner
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            <div className="leaflet-top leaflet-right">
              <div className="leaflet-control leaflet-bar flex flex-col space-y-2">
                <Tooltip title="Toggle Satellite View" placement="left">
                  <IconButton
                    onClick={toggleMapView}
                    size="small"
                    style={{ backgroundColor: isDarkMode ? '#4a5568' : 'white', color: isDarkMode ? 'white' : 'black' }}
                  >
                    {mapView === "normal" ? <FaSatellite /> : <FaMap />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Center to My Location" placement="left">
                  <IconButton
                    onClick={centerToUserLocation}
                    size="small"
                    style={{ backgroundColor: isDarkMode ? '#4a5568' : 'white', color: isDarkMode ? 'white' : 'black' }}
                  >
                    <FaLocationArrow />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <CircularProgress className="text-blue-600" />
          </div>
        )}
      </div>

      <div className={`${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-white border-gray-200"} p-4 shadow-lg border-t`}>
        {selectedLocation && (
          <p className="text-sm">
            Selected: {selectedLocation[0].toFixed(5)}, {selectedLocation[1].toFixed(5)}
          </p>
        )}

        <div className="flex space-x-2 mt-2">
          <button
            onClick={fetchItems}
            className={`flex-grow ${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-3 rounded-lg transition font-medium flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Searching...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" />
                Search This Area
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
        )}

        {reports.length === 0 && !loading && (
          <p className="mt-2 text-sm text-center">
            {selectedLocation ? "No items found in this area" : "Select a location on the map"}
          </p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;