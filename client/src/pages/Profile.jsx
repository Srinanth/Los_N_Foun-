import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Current User:", currentUser); 
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
      console.log("Fetching profile for user ID:", id);
      const response = await axios.get(`https://los-n-found.onrender.com/api/profile/${id}`);
      setUser(response.data); 
      setError(null); 
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-center mt-8">No profile data found.</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>

        <div className="flex items-center space-x-4">
          <img
            src={user.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name || "No name"}</h3>
            <p className="text-gray-600">{user.bio || "No bio available"}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-gray-700 font-medium">Email</h4>
            <p className="text-gray-600">{user.email || "Not provided"}</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Phone</h4>
            <p className="text-gray-600">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Reports Made</h4>
            <p className="text-gray-600">{user.reportsCount || 0} items reported</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Items Found</h4>
            <p className="text-gray-600">{user.foundCount || 0} items found</p>
          </div>
        </div>

        <Link to="/update">
          <button className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition flex items-center justify-center space-x-2">
            <FaUserEdit />
            <span>Edit Profile</span>
          </button>
        </Link>
      </div>
    </div>
  );
}