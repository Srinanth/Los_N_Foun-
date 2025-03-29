import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LinearProgress from '@mui/material/LinearProgress';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function ReportPage() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth(app);
  const categories = ["Electronics", "Clothing", "Home Appliances", "Books", "Automotive", "Animals/Pets"];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.error("Error getting location:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return location.lat && location.lng ? (
      <Marker position={[location.lat, location.lng]} icon={DefaultIcon} />
    ) : null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to report a lost item.");
      setLoading(false);
      return;
    }

    if (!location.lat || !location.lng) {
      setError("Please select a location on the map.");
      setLoading(false);
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("https://los-n-found.onrender.com/api/cloudinary/upload", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          imageUrl = uploadData.imageUrl;
        } else {
          throw new Error("Image upload failed.");
        }
      } catch (error) {
        setError("Image upload failed. Please try again.");
        setLoading(false);
        return;
      }
    }

    const reportData = {
      category,
      description,
      location,
      imageUrl,
    };

    try {
      const response = await fetch("https://los-n-found.onrender.com/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setCategory("");
        setDescription("");
        setLocation({ lat: null, lng: null });
        setImageFile(null);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error, please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Report a Lost Item</h2>
              <button
                onClick={() => navigate("/Home")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </button>
            </div>

            {loading && <LinearProgress color="primary" className="mb-4" />}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 text-center">
                Item reported successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the lost item (color, brand, identifying marks, etc.)"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                  {location.lat && location.lng ? (
                    <MapContainer 
                      center={[location.lat, location.lng]} 
                      zoom={15} 
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <LocationMarker />
                    </MapContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Loading map...
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">Click on the map to mark the location</p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Upload Image (Optional)</label>
                <div className="flex items-center">
                  <label className="cursor-pointer">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                      Choose File
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setImageFile(e.target.files[0])} 
                      className="hidden" 
                    />
                  </label>
                  {imageFile && (
                    <span className="ml-3 text-gray-700">{imageFile.name}</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Report Item"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}