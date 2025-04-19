import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig"; 
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { toast, Toaster } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    setIsDarkMode(storedTheme === "true");

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/Home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      toast.success('Login successful!');
      navigate("/Home"); 
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      toast.success('Logged in with Google!');
      navigate("/Home");
    } catch (error) {
      toast.error("Failed to login with Google");
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 to-white"} p-4 transition-colors duration-500`}>
      <Toaster position="top-center" />
      <div className={`flex w-full max-w-3xl shadow-lg rounded-lg overflow-hidden flex-col md:flex-row ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
        <div className={`hidden md:flex w-1/2 ${
          isDarkMode ? "bg-gradient-to-r from-gray-700 to-gray-800" : "bg-gradient-to-r from-blue-500 to-blue-600"
        } text-white flex-col justify-center items-center p-6 text-center`}>
          <h2 className="text-xl font-semibold">"Lost things have a way of finding their way back to those who cherish them." ✨🔍</h2>
          <p className="mt-4">- Anonymous</p>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <h3 className={`text-2xl font-semibold mb-6 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}>Welcome Back</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`block text-sm mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className={`block text-sm mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                }`}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className={`absolute right-3 top-8 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>

            <button 
              type="submit" 
              className={`w-full py-2 rounded-lg mt-2 hover:bg-blue-700 transition font-medium ${
                isDarkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
              }`}
            >
              Login
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className={`flex-grow border-t ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}></div>
            <span className={`mx-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}>or</span>
            <div className={`flex-grow border-t ${
              isDarkMode ? "border-gray-600" : "border-gray-300"
            }`}></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className={`w-full flex items-center justify-center py-2 rounded-lg transition font-medium ${
              isDarkMode 
                ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-white" 
                : "border-gray-300 hover:bg-gray-50"
            } border`}
          >
            <FaGoogle className="text-red-500 mr-2" /> Continue with Google
          </button>

          <p className={`text-center mt-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Don't have an account?{' '}
            <a href="/signup" className={`${
              isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
            } font-medium`}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}