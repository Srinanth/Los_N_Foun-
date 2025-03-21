import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("token", data.token);
      navigate("/Home");
    } catch (error) {
      setError(error.message);
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
          
          <div className="relative mb-3">
            <input type={passwordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            <button type="button" className="absolute right-3 top-3" onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="relative mb-3">
            <input type={confirmPasswordVisible ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            <button type="button" className="absolute right-3 top-3" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              {confirmPasswordVisible ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md mt-3 hover:bg-blue-600">
            Sign Up
          </button>
        </form>

        <div className="text-center text-gray-500 my-3">or</div>
        <button className="w-full flex justify-center items-center bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
          <FaGoogle className="mr-2" /> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;