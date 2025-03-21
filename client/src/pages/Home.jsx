import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for toggle

export default function HomePage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-blue-600 p-4 text-white relative">
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-between items-center bg-blue bg-opacity-20 backdrop-blur-xl p-4 rounded-lg shadow-md">
        <div className="flex gap-6">
          {[
            { name: "Report Items", path: "/report" },
            { name: "Recent Reports", path: "/recent" },
            { name: "Forum", path: "/forum" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`text-lg text-gray-100 transition-all duration-200 ${
                hovered === index ? "text-gray-300 scale-105" : "text-gray-100"
              }`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Mobile Navbar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 bg-blue bg-opacity-30 p-2 rounded-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-r from-purple-700 to-blue-600 p-6 z-50 transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <button className="absolute top-4 right-4 text-white" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
        <div className="mt-8 flex flex-col gap-6">
          {[
            { name: "Report Items", path: "/report" },
            { name: "Recent Reports", path: "/recent" },
            { name: "Forum", path: "/forum" },
          ].map((item, index) => (
            <Link key={index} to={item.path} className="text-lg text-white">
              {item.name}
            </Link>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className={`mt-8 transition-opacity ${isSidebarOpen ? "opacity-50" : "opacity-100"}`}>
        {/* Reported Items */}
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Your Reported Items</h2>
          <div className="bg-blue bg-opacity-20 p-4 rounded-lg shadow-lg">
            <p>No items reported yet.</p>
          </div>
        </section>

        {/* Badges */}
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
