import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold"> ReturnIt </h1>
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
        <p className="max-w-2xl text-lg">Welcome to ReturnIt – Your Campus Lost & Found Solution!
Losing or finding an item on campus can be stressful, but ReturnIt is here to make the process simple and secure! Our platform connects students to ensure lost belongings find their way back to their rightful owners.

</p>
      </header>

      {/* Content Section */}
      <main className="flex flex-col items-center px-6 py-12 space-y-8">
        <section className="max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">Recent Lost & Found Cases</h3>
          <p className="text-gray-600">Lost something? Found something? Or just here to see if someone else is as forgetful as you? Well, congratulations—you've found the right place (unlike your missing items)! But hey, the more you use this site, the more recent cases we get. So, don’t just lurk—report those lost and found cases! Otherwise, the latest ‘found item’ might still be that missing sock from 2012. Let’s keep this place updated!</p>
        </section>
        <section className="max-w-4xl w-full bg-white shadow-lg p-6 rounded-lg">
          <h3 className="text-2xl font-semibold mb-2">How It Works</h3>
          <p className="text-gray-600">
✅ Sign Up & Secure Your Account – Create an account and provide your contact details for seamless communication.<br></br>
✅ Post About Lost or Found Items – Whether you've lost something valuable or found an item, post the details to alert the community.<br></br>
✅ Smart Validation System – If you've found an item, answer a security question set by the owner before making contact. This ensures that every item is returned safely and to the right person.<br></br>
✅ Easy & Reliable Communication – Choose to connect with the other person or remain anonymous—either way, our system ensures that lost items are found!<br></br>

At ReturnIt, our goal is simple: making lost things found and helping the campus community stay connected! Start using ReturnIt today and never worry about lost items again!.</p>
        </section>
      </main>
    </div>
  );
}
