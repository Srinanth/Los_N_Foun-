import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-blue-600">ReturnIt</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-md text-blue-600 hover:bg-blue-50 transition border border-blue-600"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>
      <header className="flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <h2 className="text-4xl font-bold mb-6">Find Lost Items, Report Found Items</h2>
        <p className="max-w-2xl text-lg opacity-90">
          Welcome to ReturnIt – Your Campus Lost & Found Solution!
          Losing or finding an item on campus can be stressful, but ReturnIt is here to make the process simple and secure!
        </p>
      </header>
      <main className="flex flex-col items-center px-6 py-12 space-y-8 max-w-7xl mx-auto">
        <section className="w-full bg-white shadow-md p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">Recent Lost & Found Cases</h3>
          <p className="text-gray-600">
            Lost something? Found something? Our platform helps reunite items with their owners.
            The more you use ReturnIt, the more effective our community becomes!
          </p>
        </section>
        
        <section className="w-full bg-white shadow-md p-8 rounded-xl">
          <h3 className="text-2xl font-semibold mb-4 text-blue-600">How It Works</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2 mr-3">1</span>
              <p>Sign Up & Secure Your Account</p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2 mr-3">2</span>
              <p>Post About Lost or Found Items</p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2 mr-3">3</span>
              <p>Smart Validation System for Security</p>
            </div>
            <div className="flex items-start">
              <span className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-2 mr-3">4</span>
              <p>Easy Communication to Return Items</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="mt-auto py-6 bg-white border-t">
        <div className="text-center text-gray-500">
          © {new Date().getFullYear()} ReturnIt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}