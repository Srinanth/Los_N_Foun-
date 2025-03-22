import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/Login";
import LandingPage from "./pages/welcome";
import SignUp from "./pages/SignUp";
import UpdateProfile from "./pages/UpdateProfile";
import ProfilePage from "./pages/Profile";
import HomePage from "./pages/Home";
import ReportPage from "./pages/Report";
import FoundPage from "./pages/Found";
import RecentUpdates from "./pages/Recent";


function App() {

  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/update" element={<UpdateProfile />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/found" element={<FoundPage />} />
        <Route path="/recent" element={<RecentUpdates />} />
      </Routes>
     
    </Router>
  );
}


export default App;
