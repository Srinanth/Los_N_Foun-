// AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import { Sun, Moon, X, Menu } from "lucide-react";
import LinearProgress from "@mui/material/LinearProgress";

export default function AdminPage() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const darkClass = isDarkMode ? "dark" : "";

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (!currUser || currUser.email !== "lostndfoun@gmail.com") {
        navigate("/home");
      } else {
        setUser(currUser);
        await fetchData();
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const fetchData = async () => {
    try {
      const lostSnapshot = await getDocs(collection(db, "lostItems"));
      const foundSnapshot = await getDocs(collection(db, "foundItems"));
      const usersSnapshot = await getDocs(collection(db, "users"));

      setLostItems(lostSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setFoundItems(foundSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(doc(db, type, id));
      if (type === "lostItems") {
        setLostItems((prev) => prev.filter((item) => item.id !== id));
      } else {
        setFoundItems((prev) => prev.filter((item) => item.id !== id));
      }
      alert("Item deleted successfully.");
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} min-h-screen p-4`}>
      <nav className={`hidden md:flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm p-4 rounded-lg`}>
        <h1 className="text-xl font-bold text-blue-600">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-800" />}
          </button>
          <button onClick={handleLogout} className="bg-red-500 px-6 py-2 rounded-md text-white hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </nav>

      <button className="md:hidden fixed top-4 left-4 bg-white shadow-md p-2 rounded-md z-50" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} className="text-blue-600" />
      </button>
      <div className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-xl p-6 z-50 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-4 right-4" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
        <h1 className="text-3xl font-bold mt-8 text-blue-500">Admin</h1>
        <div className="mt-6 space-y-4">
          <Link to="/home" className="block text-lg hover:text-blue-500">Go to Home</Link>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="block w-full text-left hover:text-yellow-400">Toggle Theme</button>
          <button onClick={handleLogout} className="bg-red-500 w-full text-white px-4 py-2 mt-2 rounded hover:bg-red-600">Logout</button>
        </div>
      </div>

      <main className={`mt-16 transition-opacity ${isSidebarOpen ? "opacity-30" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto space-y-16">
          <section>
            <h2 className="text-2xl font-bold mb-4">Lost Item Reports</h2>
            {loading ? (
              <LinearProgress />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lostItems.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg shadow ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500">Location: {item.location}</p>
                    {item.image && <img src={item.image} alt="Lost" className="mt-2 rounded w-full h-48 object-cover" />}
                    <button onClick={() => handleDelete(item.id, "lostItems")} className="mt-4 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Found Item Reports</h2>
            {loading ? (
              <LinearProgress />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg shadow ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                    <p className="text-sm text-gray-500">Location: {item.location}</p>
                    {item.image && <img src={item.image} alt="Found" className="mt-2 rounded w-full h-48 object-cover" />}
                    <button onClick={() => handleDelete(item.id, "foundItems")} className="mt-4 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
            {loading ? (
              <LinearProgress />
            ) : (
              <div className={`overflow-x-auto rounded-lg shadow ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                <table className="min-w-full text-sm">
                  <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-100"} text-left`}>
                    <tr>
                      <th className="py-2 px-4">Username</th>
                      <th className="py-2 px-4">Email</th>
                      <th className="py-2 px-4">Other</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className={`${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}`}>
                        <td className="py-2 px-4">{user.username || "N/A"}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">{user.role || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
