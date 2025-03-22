import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { auth, googleProvider } from "../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Handle Email/Password Sign-up
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Update username in Firebase
      await updateProfile(user, { displayName: username });

      // 🔹 OPTIONAL: Send user details to backend
      await fetch("https://los-n-found.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, username, email }),
      });

      navigate("/Home");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // 🔹 Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // 🔹 OPTIONAL: Send user details to backend
      await fetch("https://los-n-found.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: user.uid, username: user.displayName, email: user.email }),
      });

      navigate("/Home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form className="mt-4" onSubmit={handleSignUp}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-md mb-3" required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-md mb-3" required />
          
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md mb-3" required />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md mb-3" required />

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-3 hover:bg-blue-600" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-500 my-3">or</div>

        {/* Google Auth Button */}
        <button onClick={handleGoogleSignIn} className="w-full flex justify-center items-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
          <FaGoogle className="mr-2" /> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
