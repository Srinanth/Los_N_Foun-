import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebaseConfig"; // Firebase config
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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
    return location.lat && location.lng ? <Marker position={[location.lat, location.lng]} /> : null;
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

        const uploadResponse = await fetch("http://localhost:5000/api/cloudinary/upload", {
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
      const response = await fetch("http://localhost:5000/api/report", {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-700 to-purple-600 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Report a Lost Item</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">Item reported successfully!</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the lost item"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Select Location on Map</label>
            {location.lat && location.lng ? (
              <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "250px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Upload Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Report Item"}
          </button>
        </form>
      </div>
      <button
        onClick={() => navigate("/Home")}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
      >
        Go Back to Home
      </button>
    </div>
  );
}
