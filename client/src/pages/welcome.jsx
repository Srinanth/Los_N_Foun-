import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">Lost & Found</h1>
        <div>
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md mr-2 hover:bg-gray-200 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>
      
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center p-16 bg-gradient-to-r from-purple-700 to-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Find Lost Items, Report Found Items</h2>
        <p className="max-w-2xl text-lg">Connecting people to their lost belongings through an intelligent matching system.</p>
      </header>

      {/* Content Section */}
      <main className="flex flex-col items-center px-6 py-12 space-y-8">
        <section className="max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">Recent Lost & Found Cases</h3>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
        </section>
        <section className="max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">How It Works</h3>
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed cursus ante dapibus diam.</p>
        </section>
      </main>
    </div>
  );
}
