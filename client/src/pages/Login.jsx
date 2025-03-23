import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig"; 
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/Home");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Function to log in with email & password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get Firebase token

      localStorage.setItem("token", token); 
      navigate("/Home"); 
    } catch (error) {
      setError(error.message);
    }
  };

  // 🔹 Function to log in with Google
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const token = await userCredential.user.getIdToken(); 

      localStorage.setItem("token", token);
      navigate("/Home"); 
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 p-4">
      <div className="flex w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden flex-col md:flex-row">
        {/* Left Side - Hidden on Small Screens */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-r from-purple-700 to-blue-600 text-white flex-col justify-center items-center p-6 text-center">
          <h2 className="text-xl font-semibold">Innovation distinguishes between a leader and a follower.</h2>
          <p className="mt-4">- Steve Jobs</p>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Let's Get Started</h3>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-gray-600 text-sm">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field with Toggle */}
            <div className="mb-4 relative">
              <label className="block text-gray-600 text-sm">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 transition">
              Sign In
            </button>
          </form>

          <div className="text-center text-gray-500 my-4">or sign in with</div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
          >
            <FaGoogle className="text-red-500 mr-2" /> Login with Google
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}