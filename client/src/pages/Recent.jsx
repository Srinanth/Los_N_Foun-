import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import {
  ArrowBack,
  Search,
  ShoppingCart,
  Check,
  SentimentDissatisfied,
  Email
} from "@mui/icons-material";

const RecentUpdates = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("Searching for matches...");
  const [progress, setProgress] = useState(0);
  const [emailStatus, setEmailStatus] = useState(null);
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("darkMode");
    return storedTheme ? storedTheme === "true" : false;
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setProgress(0);

    axios.get(`https://los-n-found.onrender.com/api/matches/${user.uid}`, {
      onDownloadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 100)
        );
        setProgress(percentCompleted);
      }
    })
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setMatches(response.data);
        } else {
          setMatches([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching matches:", error);
        setMatches([]);
      })
      .finally(() => {
        setLoading(false);
        setProgress(100);
      });
  }, [user, navigate]);

  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Searching database for potential matches...",
      "Analyzing item descriptions...",
      "Comparing with recently found items...",
      "Calculating match probabilities...",
      "Verifying results..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);

  const handleSendEmail = async (ownerUid, itemDetails, title) => {
    setEmailStatus("sending");
    try {
      const response = await axios.post("https://los-n-found.onrender.com/api/send-email", {
        ownerUid,
        senderEmail: user.email,
        itemDetails,
        title: `Potential Match: ${title}`,
        message: `I believe this might be my lost item. Here are the details: ${itemDetails}`
      });
      setEmailStatus("success");
      setTimeout(() => setEmailStatus(null), 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  const darkClass = isDarkMode ? "dark" : "";

  return (
    <div className={`${darkClass} min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} p-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} flex items-center`}>
            <Search color="primary" className="mr-2" />
            Potential Matches
          </h1>
          <button
            onClick={() => navigate("/Home")}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <ArrowBack className="mr-1" />
            Back to Home
          </button>
        </div>

        {emailStatus === "sending" && (
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 flex items-center">
            <CircularProgress size={20} className="mr-2" />
            Sending email...
          </div>
        )}
        {emailStatus === "success" && (
          <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-4 flex items-center">
            <Check className="mr-2" />
            Email sent successfully!
          </div>
        )}
        {emailStatus === "error" && (
          <div className="bg-red-50 text-red-800 p-3 rounded-lg mb-4 flex items-center">
            <SentimentDissatisfied className="mr-2" />
            Failed to send email. Please try again.
          </div>
        )}

        {loading && (
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md p-8`}>
            <div className="text-center">
              <CircularProgress
                size={50}
                className="text-blue-600 mb-4"
                thickness={4}
                style={{ color: isDarkMode ? '#64b5f6' : '#1e88e5' }}
              />
              <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} animate-pulse`}>{loadingText}</p>
            </div>
          </div>
        )}

        {!loading && matches.length === 0 && (
          <div className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md p-8 text-center`}>
            <div className="text-gray-400 mb-4">
              <SentimentDissatisfied style={{ fontSize: 64 }} className="mx-auto" />
            </div>
            <h3 className={`text-xl font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-2`}>No matches found</h3>
            <p className={`${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>We'll notify you when we find potential matches for your lost items.</p>
          </div>
        )}

        {!loading && matches.length > 0 && (
          <div className="space-y-6">
            {matches.map(({ lostItem, topMatches }) => (
              <div key={lostItem.id} className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white"} rounded-xl shadow-md overflow-hidden`}>

                <div className={`${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-blue-50 border-blue-100 text-gray-700"} p-4 border-b`}>
                  <h3 className={`text-lg font-semibold flex items-center ${isDarkMode ? "text-blue-400" : "text-blue-700"}`}>
                    <ShoppingCart color="primary" className="mr-2" style={{ color: isDarkMode ? '#64b5f6' : '#1e88e5' }} />
                    Your Lost Item
                  </h3>
                  <p className="mt-1">{lostItem.description}</p>
                  {lostItem.imageUrl && (
                    <div className="mt-4 flex justify-center">
                      <div className="max-w-full max-h-96 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={lostItem.imageUrl}
                          alt="Lost item"
                          className="w-full h-auto max-h-96 object-contain"
                          style={{ display: 'block' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className={`text-md font-medium flex items-center ${isDarkMode ? "text-gray-300" : "text-gray-800"} mb-3`}>
                    <Check color="success" className="mr-2" style={{ color: '#4caf50' }} />
                    Potential Matches ({topMatches.length})
                  </h4>

                  {topMatches.length > 0 ? (
                    <div className="space-y-3">
                      {topMatches.map((match) => (
                        <div
                          key={match.foundItem.id}
                          className={`${isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-700"} p-3 border rounded-lg hover:border-blue-300 transition-colors`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{match.foundItem.description}</p>
                            </div>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {match.similarity ? `${(match.similarity * 100).toFixed(1)}% match` : "Possible match"}
                            </span>
                          </div>
                          {match.foundItem.imageUrl && (
                            <div className="mt-2">
                              <img
                                src={match.foundItem.imageUrl}
                                alt="Found item"
                                className="h-full w-full object-cover rounded-md border border-gray-200"
                              />
                            </div>
                          )}
                          <div className="mt-3 flex space-x-2">
                            <button
                              onClick={() => handleSendEmail(
                                match.foundItem.userId,
                                lostItem.description,
                                lostItem.type
                              )}
                              className={`flex-1 ${isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} px-3 py-2 rounded-md transition flex items-center justify-center text-sm`}
                            >
                              <Email className="mr-1" style={{ fontSize: 16 }} />
                              Send Email
                            </button>

                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`${isDarkMode ? "bg-gray-600 text-gray-400" : "bg-gray-50 text-gray-500"} p-4 rounded-lg text-center`}>
                      No close matches found for this item
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentUpdates;