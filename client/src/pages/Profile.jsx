import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        fetchUserProfile(currentUser.uid);
      } else {
        setError("User not authenticated. Please log in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`https://los-n-found.onrender.com/api/profile/${id}`);
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const darkClass = isDarkMode ? "dark" : "";

  if (loading) {
    return <div className={`${darkClass} flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <p className={`${isDarkMode ? "text-white" : "text-blue-600"}`}>Loading...</p>
    </div>;
  }

  if (error) {
    return <div className={`${darkClass} flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (!user) {
    return <div className={`${darkClass} flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
      <p className={`${isDarkMode ? "text-white" : "text-blue-600"}`}>No profile data found.</p>
    </div>;
  }

  return (
    <div className={`${darkClass} min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>ReturnIt</h1>
          <button
            onClick={() => navigate("/Home")}
            className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} px-4 py-2 rounded-md transition`}
          >
            Go Back to Home
          </button>
        </div>

        <div className={`${isDarkMode ? "bg-gray-800 text-white shadow-lg" : "bg-white text-gray-800 shadow-lg"} rounded-xl overflow-hidden`}>
          <div className={`${isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gradient-to-r from-blue-500 to-blue-600"} h-32`}></div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center -mt-16">
              <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-1 rounded-full shadow-md`}>
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon style={{ fontSize: 96, color: isDarkMode ? '#64b5f6' : '#1e88e5' }} />
                )}
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-6">
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{user.name || "No name"}</h2>
                <div className="flex items-center mt-2">
                  <span className={`${isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"} text-xs px-2 py-1 rounded-full`}>
                    {user.email || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Phone</h3>
                <p className="mt-1 text-lg font-semibold">
                  {user.phone || "Not provided"}
                </p>
              </div>

              <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Reports Made</h3>
                <p className="mt-1 text-lg font-semibold">
                  {user.reportsCount || 0} items reported
                </p>
              </div>

              <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Items Found</h3>
                <p className="mt-1 text-lg font-semibold">
                  {user.foundCount || 0} items found
                </p>
              </div>
            </div>

            <Link to="/update" className="block mt-8">
              <button className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} w-full font-medium py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2`}>
                <FaUserEdit />
                <span>Edit Profile</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}