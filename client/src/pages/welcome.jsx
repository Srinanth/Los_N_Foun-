import { useNavigate } from "react-router-dom";
import EmailIcon from "@mui/icons-material/Email";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import GavelIcon from "@mui/icons-material/Gavel";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  const darkClass = isDarkMode ? "dark" : "";
  const textColorClass = isDarkMode ? "text-gray-300" : "text-gray-800";
  const bgColorClass = isDarkMode ? "bg-gray-900" : "bg-gradient-to-b from-blue-50 to-white";
  const navBgClass = isDarkMode ? "bg-gray-800 shadow-md" : "bg-white shadow-sm";
  const headerBgClass = isDarkMode ? "bg-gradient-to-r from-blue-700 to-blue-800 text-white" : "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
  const buttonClass = `px-4 py-2 rounded-md transition font-medium ${isDarkMode ? "text-blue-400 hover:bg-blue-800 border border-blue-400" : "text-blue-600 hover:bg-blue-50 border border-blue-600"}`;
  const primaryButtonClass = `px-4 py-2 rounded-md transition font-medium ${isDarkMode ? "bg-blue-700 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700"}`;
  const sectionBgClass = isDarkMode ? "bg-gray-800 shadow-md text-white" : "bg-white shadow-md text-gray-600";
  const sectionTitleClass = `text-2xl font-semibold mb-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`;
  const footerBgClass = isDarkMode ? "bg-gray-800 border-t border-gray-700" : "bg-white border-t";
  const footerLinkClass = `hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-600"}`;
  const footerTextColorClass = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`${darkClass} flex flex-col min-h-screen ${bgColorClass} ${textColorClass}`}>
      <nav className={`flex justify-between items-center p-6 ${navBgClass}`}>
        <h1 className={`text-4xl font-bold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>ReturnIt</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className={buttonClass}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className={primaryButtonClass}
          >
            Sign Up
          </button>
        </div>
      </nav>

      <header className={`flex flex-col items-center justify-center text-center px-6 py-20 ${headerBgClass}`}>
        <h2 className="text-4xl font-bold mb-6">Find Lost Items, Report Found Items</h2>
        <p className="max-w-2xl text-lg opacity-90">
          Welcome to ReturnIt – Your Campus Lost & Found Solution!
          Losing or finding an item on campus can be stressful, but ReturnIt is here to make the process simple and secure!
        </p>
      </header>

      <main className="flex flex-col items-center px-6 py-12 space-y-8 max-w-7xl mx-auto">
        <section className={`w-full ${sectionBgClass} p-8 rounded-xl`}>
          <h3 className={sectionTitleClass}>Recent Lost & Found Cases</h3>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Lost something? Found something? Our platform helps reunite items with their owners.
            The more you use ReturnIt, the more effective our community becomes!
          </p>
        </section>

        <section className={`w-full ${sectionBgClass} p-8 rounded-xl`}>
          <h3 className={sectionTitleClass}>How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className={`flex-shrink-0 rounded-full p-2 mr-3 ${isDarkMode ? "bg-blue-800 text-blue-400" : "bg-blue-100 text-blue-600"}`}>1</span>
              <p>Sign Up & Secure Your Account</p>
            </div>
            <div className="flex items-start">
              <span className={`flex-shrink-0 rounded-full p-2 mr-3 ${isDarkMode ? "bg-blue-800 text-blue-400" : "bg-blue-100 text-blue-600"}`}>2</span>
              <p>Post About Lost or Found Items</p>
            </div>
            <div className="flex items-start">
              <span className={`flex-shrink-0 rounded-full p-2 mr-3 ${isDarkMode ? "bg-blue-800 text-blue-400" : "bg-blue-100 text-blue-600"}`}>3</span>
              <p>Smart Validation System for Security</p>
            </div>
            <div className="flex items-start">
              <span className={`flex-shrink-0 rounded-full p-2 mr-3 ${isDarkMode ? "bg-blue-800 text-blue-400" : "bg-blue-100 text-blue-600"}`}>4</span>
              <p>Easy Communication to Return Items</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`mt-auto py-8 ${footerBgClass}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className={`text-sm ${footerTextColorClass}`}>
              © {new Date().getFullYear()} <span className={`font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>ReturnIt</span>. All rights reserved.
            </p>
            <p className={`text-sm mt-2 ${footerTextColorClass}`}>
              We’re committed to helping users find and return lost items safely and securely using modern technology and community collaboration.
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className={`flex items-center font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
              <SupportAgentIcon className="mr-2" />
              Contact Us
            </div>
            <div className="flex items-center text-sm">
              <EmailIcon className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-500"}`} />
              <a href="mailto:support@returnit.com" className={`${footerLinkClass}`}>
                support@returnit.com
              </a>
            </div>
            <p className={`text-sm mt-2 ${footerTextColorClass}`}>
              Support available: 24/7
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className={`font-semibold mb-2 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>Our Policies</div>
            <div className="flex items-center text-sm mb-1">
              <GavelIcon className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-500"}`} />
              <a href="#" className={footerLinkClass}>Terms of Service</a>
            </div>
            <div className="flex items-center text-sm mb-1">
              <PrivacyTipIcon className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-500"}`} />
              <a href="#" className={footerLinkClass}>Privacy Policy</a>
            </div>
            <div className="flex items-center text-sm">
              <HelpOutlineIcon className={`mr-2 ${isDarkMode ? "text-blue-500" : "text-blue-500"}`} />
              <a href="#" className={footerLinkClass}>FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}