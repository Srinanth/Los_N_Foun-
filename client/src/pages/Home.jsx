import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Icons for toggle
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig"; // Firebase config

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportedItems, setReportedItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state

  const auth = getAuth(app);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        // Set userId from Firebase Authentication
        setUserId(user.uid);

        // Query lost items
        const lostQuery = query(collection(db, "reportedItems"), where("userId", "==", user.uid));
        const lostSnapshot = await getDocs(lostQuery);
        const lostData = lostSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Query found items
        const foundQuery = query(collection(db, "foundItems"), where("userId", "==", user.uid));
        const foundSnapshot = await getDocs(foundQuery);
        const foundData = foundSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setReportedItems(lostData);
        setFoundItems(foundData);
      } catch (err) {
        setError("Failed to fetch reported items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [navigate, auth, db]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 p-4 text-white relative">
      {/* Navbar */}
      <nav className="hidden md:flex justify-between items-center bg-blue bg-opacity-20 backdrop-blur-xl p-4 rounded-lg shadow-md">
        <div className="flex gap-6">
          {[
            { name: "Report Lost", path: "/report" },
            { name: "Report Found", path: "/found" },
            { name: "Forum", path: "/forum" },
            { name: "Recent Posts", path: "/recent" },
            { name: "Your Profile", path: `/profile/${userId}` }, // Use userId here
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`text-lg transition-all duration-200 ${hovered === index ? "text-gray-300 scale-105" : "text-gray-100"}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition">
          Logout
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <button className="md:hidden fixed top-4 left-4 bg-blue bg-opacity-30 p-2 rounded-md" onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </button>

      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-r from-purple-700 to-blue-600 p-6 z-50 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <button className="absolute top-4 right-4 text-white" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
        <div className="mt-8 flex flex-col gap-6">
          {[
            { name: "Report Lost", path: "/report" },
            { name: "Report Found", path: "/found" },
            { name: "Forum", path: "/forum" },
            { name: "Recent Posts", path: "/recent" },
            { name: "Your Profile", path: `/profile/${userId}` }, // Use userId here
          ].map((item, index) => (
            <Link key={index} to={item.path} onClick={() => setIsSidebarOpen(false)} className="text-lg text-white">
              {item.name}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} className="mt-6 w-full bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className={`mt-8 transition-opacity ${isSidebarOpen ? "opacity-50" : "opacity-100"}`}>
        {/* Lost Items Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 p-5">Your Lost Items</h2>

          {/* Loading State */}
          {loading ? (
            <p className="text-gray-200">Loading...</p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportedItems.length > 0 ? (
                reportedItems.map((item) => (
                  <div key={item.id} className="bg-blue bg-opacity-20 p-4 rounded-lg shadow-lg">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.category} className="w-full h-48 object-cover rounded-md mb-4" />}
                    <h3 className="text-xl font-semibold mb-2">{item.category}</h3>
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                ))
              ) : (
                <div className="bg-blue bg-opacity-20 p-4 rounded-lg shadow-lg">
                  <p>No lost items reported yet.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Found Items Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 p-5">Your Found Items</h2>

          {/* Loading State */}
          {loading ? (
            <p className="text-gray-200">Loading...</p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundItems.length > 0 ? (
                foundItems.map((item) => (
                  <div key={item.id} className="bg-green-500 bg-opacity-20 p-4 rounded-lg shadow-lg">
                    {item.imageUrl && <img src={item.imageUrl} alt={item.category} className="w-full h-48 object-cover rounded-md mb-4" />}
                    <h3 className="text-xl font-semibold mb-2">{item.category}</h3>
                    <p className="text-gray-200">{item.description}</p>
                  </div>
                ))
              ) : (
                <div className="bg-green-500 bg-opacity-20 p-4 rounded-lg shadow-lg">
                  <p>No found items reported yet.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Badges Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Your Badges</h2>
          <div className="bg-blue bg-opacity-20 p-4 rounded-lg shadow-lg">
            <p>No badges earned yet.</p>
          </div>
        </section>
      </div>
    </div>
  );
}