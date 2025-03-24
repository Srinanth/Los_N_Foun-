import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        fetchUserProfile(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${id}`);
      setFormData(response.data); // Set form data with fetched profile
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]); // Set the selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    let imageUrl = formData.profileImage; // Keep existing image if no new upload

    // Upload new image to Cloudinary if a file is selected
    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);
      formDataImage.append("05126aca-df9a-4327-83c0-c29a1a6dbc04", "profile"); // Replace with your Cloudinary upload preset

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dhaykn4ec/image/upload", // Replace with your Cloudinary cloud name
          formDataImage
        );
        imageUrl = response.data.secure_url; // Get uploaded image URL
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Image upload failed!");
        setLoading(false); // Stop loading
        return;
      }
    }

    // Update profile data with the new image URL
    try {
      await axios.put(`http://localhost:5000/api/profile/${userId}`, {
        ...formData,
        profileImage: imageUrl,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <input
            name="name"
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            className="w-full p-2 border rounded"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Address */}
          <input
            name="address"
            type="text"
            placeholder="Address"
            className="w-full p-2 border rounded"
            value={formData.address}
            onChange={handleChange}
          />


          {/* Profile Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded"
              onChange={handleImageChange}
            />
            {formData.profileImage && (
              <img
                src={formData.profileImage}
                alt="Current Profile"
                className="w-24 h-24 rounded-full mt-2"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Saving..." : "Save Profile"}
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