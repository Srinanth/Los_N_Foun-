import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Spinner from '../components/spin';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [reportedItems, setReportedItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  const navigate = useNavigate();
  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid);
        fetchUserProfile(currentUser.uid);
        fetchReports(currentUser.uid);
      } else {
        setError("User not authenticated. Please log in.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate, auth]);

  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`https://los-n-found.onrender.com/api/profile/${id}`);
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (userId) => {
    try {
      const lostQuery = query(collection(db, "reportedItems"), where("userId", "==", userId));
      const lostSnapshot = await getDocs(lostQuery);
      const lostData = lostSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const foundQuery = query(collection(db, "foundItems"), where("userId", "==", userId));
      const foundSnapshot = await getDocs(foundQuery);
      const foundData = foundSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setReportedItems(lostData);
      setFoundItems(foundData);
    } catch (err) {
      console.error("Failed to fetch reported items", err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
        <Spinner size="lg" color={isDarkMode ? "blue" : "blue"} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex justify-center items-center min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-blue-50"}`}>
        <p className={`${isDarkMode ? "text-white" : "text-blue-600"}`}>No profile data found.</p>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} min-h-screen p-4 transition-colors duration-500`}>
      {/* Desktop Navigation */}
      <nav className={`hidden md:flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm p-4 rounded-lg`}>
        <div className="flex items-center space-x-19">
          <Link to="/Home" className={`text-2xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
            ReturnIt
          </Link>
          <div className="flex gap-45">
            {[
              { name: "Report Lost", path: "/report" },
              { name: "Report Found", path: "/found" },
              { name: "Forum", path: "/forum" },
              { name: "Recent Posts", path: "/recent" },
              { name: "Map", path: "/map" },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`text-lg transition-all duration-200 ${hovered === index ? "text-blue-500 scale-105" : isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-800" />}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-white font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-8 left-4 z-50 flex items-center space-x-2">
        <button
          className="bg-white shadow-md p-2 rounded-md"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={24} className="text-blue-600" />
        </button>
        <Link to="/Home" className={`text-3xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
          ReturnIt
        </Link>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-xl p-6 z-50 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <button className="absolute top-4 right-4" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
        </button>
        <Link to="/Home" className={`mt-8 block text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
          ReturnIt
        </Link>
        <div className={`h-0.5 w-52 mt-5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`}></div>
        <div className="mt-12 flex flex-col gap-4">
          {[
            { name: "Report Lost", path: "/report" },
            { name: "Report Found", path: "/found" },
            { name: "Forum", path: "/forum" },
            { name: "Recent Posts", path: "/recent" },
            { name: "Map", path: "/map" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`text-lg hover:text-blue-500 p-2 rounded hover:bg-blue-100 transition ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700"}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition`}
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-800" />}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-white font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`mt-26 transition-opacity ${isSidebarOpen ? "opacity-30" : "opacity-100"}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`${isDarkMode ? "bg-gray-800 text-white shadow-lg" : "bg-white text-gray-800 shadow-lg"} rounded-xl overflow-hidden`}>
            <div className={`${isDarkMode ? "bg-gradient-to-r from-blue-600 to-blue-700" : "bg-gradient-to-r from-blue-500 to-blue-600"} h-32`}></div>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center -mt-16">
                <div className={`${isDarkMode ? "bg-gray-700" : "bg-white"} p-1 rounded-full shadow-md`}>
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <AccountCircleIcon style={{ fontSize: 96, color: isDarkMode ? '#64b5f6' : '#1e88e5' }} />
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{user.name || "No name"}</h2>
                  <div className="flex items-center mt-2">
                    <span className={`${isDarkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"} text-xs px-2 py-1 rounded-full`}>
                      {user.email || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Phone</h3>
                  <p className="mt-1 text-lg font-semibold">
                    {user.phone || "Not provided"}
                  </p>
                </div>

                <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Reports Made</h3>
                  <p className="mt-1 text-lg font-semibold">
                    {reportedItems.length || 0} items reported
                  </p>
                </div>

                <div className={`${isDarkMode ? "bg-gray-700 text-white" : "bg-blue-50 text-gray-800"} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium uppercase tracking-wider ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}>Items Found</h3>
                  <p className="mt-1 text-lg font-semibold">
                    {foundItems.length || 0} items found
                  </p>
                </div>
              </div>

              <Link to="/update" className="block mt-8">
                <button className={`${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} w-full font-medium py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2`}>
                  <FaUserEdit />
                  <span>Edit Profile</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}