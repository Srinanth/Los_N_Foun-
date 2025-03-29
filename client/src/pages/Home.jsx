import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { app } from "../firebaseConfig"; 
import LinearProgress from '@mui/material/LinearProgress';

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reportedItems, setReportedItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); 

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
        setUserId(user.uid);
        const lostQuery = query(collection(db, "reportedItems"), where("userId", "==", user.uid));
        const lostSnapshot = await getDocs(lostQuery);
        const lostData = lostSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 relative">
      <nav className="hidden md:flex justify-between items-center bg-white shadow-sm p-4 rounded-lg">
        <div className="flex gap-6">
          {[
            { name: "Report Lost", path: "/report" },
            { name: "Report Found", path: "/found" },
            { name: "Forum", path: "/forum" },
            { name: "Recent Posts", path: "/recent" },
            { name: "Map", path: "/map" },
            { name: "Your Profile", path: `/profile/${userId}` }, 
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`text-lg transition-all duration-200 ${hovered === index ? "text-blue-600 scale-105" : "text-gray-700"}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-white font-medium"
        >
          Logout
        </button>
      </nav>
      <button 
        className="md:hidden fixed top-4 left-4 bg-white shadow-md p-2 rounded-md z-50"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} className="text-blue-600" />
      </button>

      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6 z-50 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <button 
          className="absolute top-4 right-4 text-gray-500"
          onClick={() => setIsSidebarOpen(false)}
        >
          <X size={24} />
        </button>
        <div className="mt-12 flex flex-col gap-4">
          {[
            { name: "Report Lost", path: "/report" },
            { name: "Report Found", path: "/found" },
            { name: "Forum", path: "/forum" },
            { name: "Recent Posts", path: "/recent" },
            { name: "Map", path: "/map" },
            { name: "Your Profile", path: `/profile/${userId}` }, 
          ].map((item, index) => (
            <Link 
              key={index} 
              to={item.path} 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-lg text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button 
          onClick={handleLogout} 
          className="mt-6 w-full bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition text-white font-medium"
        >
          Logout
        </button>
      </div>
      <div className={`mt-16 transition-opacity ${isSidebarOpen ? "opacity-30" : "opacity-100"}`}>
        <div className="max-w-7xl mx-auto">
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Lost Items</h2>
              <Link 
                to="/report" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Report New Item
              </Link>
            </div>

            {loading ? (
              <LinearProgress color="primary" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportedItems.length > 0 ? (
                  reportedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.category} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.category}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Lost
                          </span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <p className="text-gray-500 mb-4">No lost items reported yet</p>
                    <Link 
                      to="/report" 
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Report Lost Item
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Found Items</h2>
              <Link 
                to="/found" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                + Report Found Item
              </Link>
            </div>

            {loading ? (
              <LinearProgress color="primary" />
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {foundItems.length > 0 ? (
                  foundItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      {item.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={item.imageUrl} 
                            alt={item.category} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.category}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Found
                          </span>
                        </div>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full bg-white p-8 rounded-xl shadow-sm text-center">
                    <p className="text-gray-500 mb-4">No found items reported yet</p>
                    <Link 
                      to="/found" 
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                      Report Found Item
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Badges</h2>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <p className="text-gray-500 mb-4">No badges earned yet</p>
              <Link 
                to="/Home" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Available Badges
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}