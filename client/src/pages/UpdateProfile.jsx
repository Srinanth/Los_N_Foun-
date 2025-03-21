import { useState } from "react";
import { FaEye, FaEyeSlash, FaUserEdit } from "react-icons/fa";

export default function UpdateProfile() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Profile</h2>

        {/* Profile Picture Upload */}
        <div className="flex items-center space-x-4">
          <label className="relative cursor-pointer">
            <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <FaUserEdit className="text-gray-500 text-3xl" />
              </div>
            )}
          </label>
          <p className="text-gray-600">Click to upload a profile picture</p>
        </div>

        {/* Form Fields */}
        <form className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-gray-600 text-sm">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded mt-1" placeholder="Enter your email" />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-600 text-sm">Phone Number</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded mt-1" placeholder="Enter your phone number" />
            </div>
          </div>

          {/* Address */}
          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Address</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded mt-1" placeholder="Enter your address" />
          </div>

          {/* Bio */}
          <div className="mt-4">
            <label className="block text-gray-600 text-sm">Bio</label>
            <textarea className="w-full px-4 py-2 border border-gray-300 rounded mt-1" rows="3" placeholder="Tell us about yourself"></textarea>
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* New Password */}
            <div className="relative">
              <label className="block text-gray-600 text-sm">New Password</label>
              <input type={passwordVisible ? "text" : "password"} className="w-full px-4 py-2 border border-gray-300 rounded mt-1" placeholder="Enter new password" />
              <button type="button" className="absolute right-3 top-9 text-gray-500" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-600 text-sm">Confirm Password</label>
              <input type={confirmPasswordVisible ? "text" : "password"} className="w-full px-4 py-2 border border-gray-300 rounded mt-1" placeholder="Confirm new password" />
              <button type="button" className="absolute right-3 top-9 text-gray-500" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Save Profile Button */}
          <button className="w-full bg-blue-500 text-white py-2 rounded mt-6 hover:bg-blue-600 transition">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
