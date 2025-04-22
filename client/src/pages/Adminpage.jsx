import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { Menu, X, Moon, Sun, Trash2 } from "lucide-react";
import LinearProgress from '@mui/material/LinearProgress';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [users, setUsers] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // Check admin status and fetch data
  useEffect(() => {
    const checkAdminAndFetchData = async () => {
      try {
        const user = auth.currentUser;
        
        if (!user || user.email !== "admin@returnit.com") {
          navigate("/home");
          return;
        }

        // Fetch all data in parallel
        const [lostSnapshot, foundSnapshot, usersSnapshot] = await Promise.all([
          getDocs(collection(db, "lostItems")),
          getDocs(collection(db, "foundItems")),
          getDocs(collection(db, "users"))
        ]);

        setLostItems(lostSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFoundItems(foundSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
      } catch (err) {
        setError("Failed to fetch admin data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchData();
  }, [navigate, auth, db]);

  const handleDeleteLostItem = async (id) => {
    try {
      await deleteDoc(doc(db, "lostItems", id));
      setLostItems(lostItems.filter(item => item.id !== id));
      alert("Lost item deleted successfully");
    } catch (err) {
      alert("Failed to delete lost item");
      console.error(err);
    }
  };

  const handleDeleteFoundItem = async (id) => {
    try {
      await deleteDoc(doc(db, "foundItems", id));
      setFoundItems(foundItems.filter(item => item.id !== id));
      alert("Found item deleted successfully");
    } catch (err) {
      alert("Failed to delete found item");
      console.error(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} min-h-screen p-4 transition-colors duration-500`}>
      <nav className={`hidden md:flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm p-4 rounded-lg`}>
        <div className="flex gap-45 space-x-4">
          {[
            { name: "Admin Dashboard", path: "/admin" },
            { name: "Lost Items", path: "#lost" },
            { name: "Found Items", path: "#found" },
            { name: "User Management", path: "#users" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`text-lg transition-all duration-200 hover:text-blue-500 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
            >
              {item.name}
            </a>
          ))}
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
            className="bg-red-500 px-6 py-2 rounded-md hover:bg-red-600 transition text-white font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <button
        className="md:hidden fixed top-4 left-4 bg-white shadow-md p-2 rounded-md z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} className="text-blue-600" />
      </button>
      <div className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-xl p-6 z-50 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <button className="absolute top-4 right-4" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`} />
        </button>
        <h1 className={`mt-8 block text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
          Admin Panel
        </h1>
        <div className={`h-0.5 w-52 mt-5 ${isDarkMode ? "bg-blue-400" : "bg-blue-600"}`}></div>
        <div className="mt-12 flex flex-col gap-4">
          {[
            { name: "Lost Items", path: "#lost" },
            { name: "Found Items", path: "#found" },
            { name: "User Management", path: "#users" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`text-lg hover:text-blue-500 p-2 rounded hover:bg-blue-100 transition ${isDarkMode ? "text-white hover:bg-gray-700" : "text-gray-700"}`}
            >
              {item.name}
            </a>
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

      <div className={`mt-16 transition-opacity ${isSidebarOpen ? "opacity-30" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto">
          {/* Lost Items Section */}
          <section id="lost" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Lost Item Reports</h2>
            {loading ? (
              <LinearProgress color="primary" />
            ) : error ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.length > 0 ? (
                  lostItems.map((item) => (
                    <div key={item.id} className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold mb-2">{item.category || "Untitled Item"}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Lost</span>
                        </div>
                        <p className="text-sm mb-2">{item.description || "No description provided"}</p>
                        <p className="text-xs mb-3 text-gray-500">{item.location || "Location not specified"}</p>
                        <button
                          onClick={() => handleDeleteLostItem(item.id)}
                          className={`flex items-center gap-1 ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"} transition`}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`col-span-full p-8 rounded-xl shadow-sm text-center ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"}`}>
                    No lost items reported yet
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Found Items Section */}
          <section id="found" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Found Item Reports</h2>
            {loading ? (
              <LinearProgress color="primary" />
            ) : error ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.length > 0 ? (
                  foundItems.map((item) => (
                    <div key={item.id} className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold mb-2">{item.category || "Untitled Item"}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Found</span>
                        </div>
                        <p className="text-sm mb-2">{item.description || "No description provided"}</p>
                        <p className="text-xs mb-3 text-gray-500">{item.location || "Location not specified"}</p>
                        <button
                          onClick={() => handleDeleteFoundItem(item.id)}
                          className={`flex items-center gap-1 ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"} transition`}
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`col-span-full p-8 rounded-xl shadow-sm text-center ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"}`}>
                    No found items reported yet
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Users Section */}
          <section id="users" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
            {loading ? (
              <LinearProgress color="primary" />
            ) : error ? (
              <div className={`p-4 rounded-lg ${isDarkMode ? "bg-red-900 text-red-200" : "bg-red-100 text-red-800"}`}>
                {error}
              </div>
            ) : (
              <div className={`overflow-x-auto rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                {users.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-50"}>
                      <tr>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                          Username
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                          Email
                        </th>
                        <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                          User ID
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}>
                      {users.map((user) => (
                        <tr key={user.id} className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.username || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                            {user.id}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={`p-8 rounded-xl shadow-sm text-center ${isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"}`}>
                    No users registered yet
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}