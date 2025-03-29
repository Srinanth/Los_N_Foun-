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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <p className="text-blue-600">Loading...</p>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen bg-blue-50">
      <p className="text-blue-600">No profile data found.</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">ReturnIt</h1>
          <button
            onClick={() => navigate("/Home")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go Back to Home
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32"></div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center -mt-16">
              <div className="bg-white p-1 rounded-full shadow-md">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircleIcon style={{ fontSize: 96 }} className="text-blue-500" />
                )}
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6">
                <h2 className="text-2xl font-bold text-gray-800">{user.name || "No name"}</h2>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {user.email || "Not provided"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Phone</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {user.phone || "Not provided"}
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Reports Made</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {user.reportsCount || 0} items reported
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Items Found</h3>
                <p className="mt-1 text-lg font-semibold text-gray-800">
                  {user.foundCount || 0} items found
                </p>
              </div>
            </div>

            <Link to="/update" className="block mt-8">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2">
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