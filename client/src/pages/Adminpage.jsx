import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, Trash2, MoreVertical, Edit } from "lucide-react";
import { getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

export default function AdminPage() {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [reportedItems, setReportedItems] = useState([
    {
      id: "1",
      category: "Wallet",
      description: "Black leather wallet with two credit cards, driver's license, and college ID. Slight scratch on the front corner.",
      imageUrl: "https://media.istockphoto.com/id/180756294/photo/wallet.jpg?s=2048x2048&w=is&k=20&c=LsLYeSiy8Kk8XGXCmWBD-vukSQWJMNVbhIyVghEEXxM=&auto=format&fit=crop",
      location: "Main Campus - Building A",
      status: "Lost"
    },
    {
      id: "2",
      category: "Laptop",
      description: "13-inch MacBook Pro in a silver case with a 'Code Like a Pro' sticker on the back. Slight dent on the top left corner.",
      imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop",
      location: "Library - 2nd Floor",
      status: "Lost"
    },
    {
      id: "3",
      category: "Keys",
      description: "Bunch of 5 metal keys on a ring with a blue plastic tag labeled 'B-Block 23'.",
      imageUrl: "https://images.pexels.com/photos/842528/pexels-photo-842528.jpeg?w=500&auto=format&fit=crop",
      location: "Cafeteria",
      status: "Lost"
    },
    {
      id: "4",
      category: "Phone",
      description: "iPhone 12 with a matte black case. The lock screen has a dog wallpaper. May have low battery.",
      imageUrl: "https://media.istockphoto.com/id/1197063359/photo/woman-using-apple-iphone-11-pro-smartphone.jpg?s=2048x2048&w=is&k=20&c=Q8nQ4II_VJlaukvKvCl4kix6LUGczuFTQAmr9jEOs6s=&auto=format&fit=crop",
      location: "Sports Complex",
      status: "Lost"
    },
    {
      id: "9",
      category: "Watch",
      description: "Black Fossil smartwatch with a leather strap and a cracked screen protector.",
      imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&auto=format&fit=crop",
      location: "Men's Restroom - Admin Block",
      status: "Lost"
    },
    {
      id: "11",
      category: "Headphones",
      description: "Black wireless Sony headphones in a soft case with minor scratches on the left ear cup.",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop",
      location: "Music Room",
      status: "Lost"
    },
    {
      id: "12",
      category: "Calculator",
      description: "Casio FX-991ES PLUS scientific calculator with name written on the back in black ink.",
      imageUrl: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500&auto=format&fit=crop",
      location: "Exam Hall 2",
      status: "Lost"
    }
  ]);

  const [foundItems, setFoundItems] = useState([
    {
      id: "5",
      category: "Backpack",
      description: "Blue Jansport backpack containing 3 textbooks, a pencil pouch, and a laptop charger.",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop",
      location: "Lecture Hall B",
      status: "Found"
    },
    {
      id: "6",
      category: "Glasses",
      description: "Black rectangular prescription glasses inside a brown leather case with initials 'RK'.",
      imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop",
      location: "Computer Lab",
      status: "Found"
    },
    {
      id: "7",
      category: "Notebook",
      description: "Spiral-bound notebook with 'Organic Chemistry' written on the first page. Green plastic cover.",
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&auto=format&fit=crop",
      location: "Chemistry Department",
      status: "Found"
    },
    {
      id: "8",
      category: "Water Bottle",
      description: "Silver stainless steel bottle with several cartoon character stickers. Slightly dented at the bottom.",
      imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop",
      location: "Gym",
      status: "Found"
    },
    {
      id: "14",
      category: "Earphones",
      description: "White Apple earphones found tangled on a bench. Minor dirt on wires.",
      imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop",
      location: "Bus Stop",
      status: "Found"
    },
    {
      id: "15",
      category: "Cap",
      description: "Black Nike cap with white logo, slightly faded. Found on a stair railing.",
      imageUrl: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500&auto=format&fit=crop",
      location: "Stadium Entrance",
      status: "Found"
    },
    {
      id: "16",
      category: "Umbrella",
      description: "Blue foldable umbrella with a wooden handle. Wet and placed on a bench near the entrance.",
      imageUrl: "https://media.istockphoto.com/id/866721702/photo/blue-umbrella.jpg?s=2048x2048&w=is&k=20&c=YWt75t-vdqUoAXyRVnE6l5mVEpQ1UfSZlsnyOzEEDNs=&auto=format&fit=crop",
      location: "Library Gate",
      status: "Found"
    },
    {
      id: "17",
      category: "Power Bank",
      description: "Red Mi power bank with 20000mAh capacity. Found unplugged near a charging station.",
      imageUrl: "https://media.istockphoto.com/id/1159079715/photo/blue-external-battery.jpg?s=2048x2048&w=is&k=20&c=igmq2ibBU-isQPN732s1IuOjQ5MX8lW4N8zD4HLy_9g=&auto=format&fit=crop",
      location: "Student Lounge",
      status: "Found"
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: "u1",
      username: "Kevin Jose",
      email: "kevin@gmail.com"
    },
    {
      id: "u2",
      username: "Gopika",
      email: "Gopzz@gmail.com"
    },
    {
      id: "u3",
      username: "Cinol Samson",
      email: "cinol@gmail.com"
    },
    {
      id: "u4",
      username: "Ardra",
      email: "Ardra@gmail.com"
    },
    {
      id: "u5",
      username: "Shwetha",
      email: "shwetha@gmail.com"
    },
    {
      id: "u6",
      username: "Pranav",
      email: "pranav@gmail.com"
    },
     {
      id: "u7",
      username: "Srinanth",
      email: "srinanth@gmail.com"
    }
  ]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleDeleteItem = (collectionName, id, setItems) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setItems(prev => prev.filter(item => item.id !== id));
    alert("Item deleted successfully");
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers(prev => prev.filter(user => user.id !== userId));
    setActiveMenu(null);
    alert("User deleted successfully");
  };

  const handleLogout = () => {
    auth.signOut();
    navigate("/login");
  };

  const toggleMenu = (userId) => {
    setActiveMenu(activeMenu === userId ? null : userId);
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
              className={`text-lg transition-all duration-200 ${hovered === index ? "text-blue-500 scale-105" : isDarkMode ? "text-gray-300" : "text-gray-700"}`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
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

          <section id="lost" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Lost Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportedItems.map((item) => (
                <div key={item.id} className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2">{item.category}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Lost</span>
                    </div>
                    <p className="text-sm mb-2">{item.description}</p>
                    <p className="text-xs mb-3 text-gray-500">{item.location}</p>
                    <button
                      onClick={() => handleDeleteItem("reportedItems", item.id, setReportedItems)}
                      className={`flex items-center gap-1 ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"} transition`}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="found" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Found Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundItems.map((item) => (
                <div key={item.id} className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
                  {item.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2">{item.category}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Found</span>
                    </div>
                    <p className="text-sm mb-2">{item.description}</p>
                    <p className="text-xs mb-3 text-gray-500">{item.location}</p>
                    <button
                      onClick={() => handleDeleteItem("foundItems", item.id, setFoundItems)}
                      className={`flex items-center gap-1 ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"} transition`}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="users" className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Registered Users</h2>
            <div className={`overflow-x-auto rounded-xl shadow-sm ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
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
                    <th scope="col" className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-700 bg-gray-800" : "divide-gray-200 bg-white"}`}>
                  {users.map((user) => (
                    <tr key={user.id} className={isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                        <button 
                          onClick={() => toggleMenu(user.id)}
                          className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeMenu === user.id && (
                          <div className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md shadow-lg ${isDarkMode ? "bg-gray-700" : "bg-white"} ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                            <div className="py-1">
                              <button
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-gray-600" : "text-gray-700 hover:bg-gray-100"}`}
                              >
                                <Edit size={14} className="mr-2" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className={`flex items-center w-full px-4 py-2 text-sm ${isDarkMode ? "text-red-400 hover:bg-gray-600" : "text-red-600 hover:bg-gray-100"}`}
                              >
                                <Trash2 size={14} className="mr-2" /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}