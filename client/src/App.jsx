import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login";
import LandingPage from "./pages/welcome";
import SignUp from "./pages/SignUp";
import UpdateProfile from "./pages/UpdateProfile";
import ProfilePage from "./pages/Profile";
import HomePage from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/update" element={<UpdateProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
