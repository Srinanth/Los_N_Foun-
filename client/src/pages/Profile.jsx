import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  // Dummy user data (can be fetched from API)
  const [user, setUser] = useState({
    profileImage: "https://via.placeholder.com/150",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, City, Country",
    bio: "Passionate developer and tech enthusiast.",
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile</h2>

        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600">Software Engineer</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-gray-700 font-medium">Email</h4>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Phone</h4>
            <p className="text-gray-600">{user.phone}</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Address</h4>
            <p className="text-gray-600">{user.address}</p>
          </div>
          <div>
            <h4 className="text-gray-700 font-medium">Bio</h4>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>

        {/* Edit Profile Button */}
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
