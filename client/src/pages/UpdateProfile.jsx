import { useState, useEffect } from "react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { FaArrowLeft } from "react-icons/fa";

export default function UpdateProfile() {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await axios.get(`https://los-n-found.onrender.com/api/profile/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let imageUrl = formData.profileImage;

    if (imageFile) {
      const formDataImage = new FormData();
      formDataImage.append("file", imageFile);
      formDataImage.append("upload_preset", "profile");

      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          formDataImage
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Image upload failed!");
        setLoading(false);
        return;
      }
    }

    try {
      await axios.put(`https://los-n-found.onrender.com/api/profile/${userId}`, {
        ...formData,
        profileImage: imageUrl,
      });
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <FaArrowLeft className="mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">ReturnIt</h1>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-16 md:h-32"></div>
          
          <div className="px-4 md:px-6 pb-6">
            <div className="flex flex-col items-center relative">
              <div className="relative -mt-12 md:-mt-20 bg-white p-1 rounded-full shadow-md">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon style={{ fontSize: 96 }} className="text-blue-500 md:text-[128px]" />
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 md:mt-6 mb-4 md:mb-6">
                Update Profile
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="mt-2">
                <label className="block text-sm font-medium text-blue-600 mb-1">
                  Change Profile Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-2 file:py-1 md:file:py-2 file:px-3 md:file:px-4
                    file:rounded-md file:border-0
                    file:text-xs md:file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={handleImageChange}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 md:p-4">
                  <p className="text-red-700 text-sm md:text-base">{error}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Phone</label>
                  <input
                    name="phone"
                    type="text"
                    className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="pt-2 md:pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 md:py-3 px-4 rounded-lg transition flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}