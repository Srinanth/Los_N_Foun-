import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig";
import { CircularProgress } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username.trim()) return toast.error("Username is required");
    if (!email.trim()) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username });

      const res = await fetch("https://los-n-found.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, username, email }),
      });

      if (!res.ok) throw new Error("Failed to save user to database");

      toast.success("Account created successfully!");
      navigate("/Home");
    } catch (err) {
      console.error("Signup Error:", err);
      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error("Email already in use.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address.");
          break;
        case "auth/weak-password":
          toast.error("Password too weak (min 6 characters).");
          break;
        default:
          toast.error(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      await fetch("https://los-n-found.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, username: user.displayName, email: user.email }),
      });

      toast.success("Signed in with Google!");
      navigate("/Home");
    } catch (err) {
      toast.error(err.message || "Google Sign-In failed.");
    }
  };

  const darkClass = isDarkMode ? "dark" : "";

  return (
    <div className={`${darkClass} flex items-center justify-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 to-white"} p-4`}>
      <div className={`flex w-full max-w-3xl ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-lg rounded-lg overflow-hidden flex-col md:flex-row`}>
        <div className={`hidden md:flex w-1/2 ${isDarkMode ? "bg-gray-700" : "bg-gradient-to-r from-blue-500 to-blue-600"} text-white flex-col justify-center items-center p-6 text-center`}>
          <h2 className="text-xl font-semibold">"Join our community of helpful students"</h2>
          <p className="mt-4">ReturnIt makes campus life easier for everyone</p>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"} mb-6`}>Create Your Account</h3>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Choose a username"
                required
              />
            </div>

            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label className={`block text-sm mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2 border ${isDarkMode ? "border-gray-600 bg-gray-700 text-white" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full ${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} py-2 rounded-lg mt-2 font-medium flex items-center justify-center`}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
            <span className={`mx-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>or</span>
            <div className={`flex-grow border-t ${isDarkMode ? "border-gray-600" : "border-gray-300"}`}></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className={`w-full flex items-center justify-center border ${isDarkMode ? "border-gray-600 text-white hover:bg-gray-700" : "border-gray-300 hover:bg-gray-50 text-gray-700"} py-2 rounded-lg transition font-medium`}
          >
            <FaGoogle className="text-red-500 mr-2" /> Continue with Google
          </button>

          <p className={`text-center mt-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Already have an account?{' '}
            <a href="/login" className={`font-medium ${isDarkMode ? "text-blue-400 hover:underline" : "text-blue-600 hover:underline"}`}>
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;