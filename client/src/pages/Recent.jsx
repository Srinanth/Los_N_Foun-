import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig"; // Import Firebase auth & db
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RecentUpdates = () => {
  const [matches, setMatches] = useState([]);
  const user = auth.currentUser; // Get logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Fetch match results
    axios.get(`http://localhost:5000/api/matches/${user.uid}`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setMatches(response.data);
        } else {
          setMatches([]); // Handle invalid response
        }
      })
      .catch((error) => {
        setMatches([]); // Handle error
      });
  }, [user]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">🔍 Recent Matches for Your Lost Items</h2>
      {matches.length === 0 ? (
        <p className="text-gray-500 mt-4">No matches found yet.</p>
      ) : (
        matches.map(({ lostItem, topMatches }) => (
          <div key={lostItem.id} className="bg-white p-4 mt-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600">Lost Item: {lostItem.description}</h3>
            {topMatches.length > 0 ? (
              topMatches.map((match, index) => (
                <div key={match.foundItem.id} className="mt-2 p-2 border rounded-lg">
                  <p className="text-gray-700">
                    <strong>Found:</strong> {match.foundItem.description}
                  </p>
                  <p className="text-green-600 font-bold">
                    Similarity: {match.similarity ? match.similarity.toFixed(4) : "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 mt-2">No close matches found.</p>
            )}
          </div>
        ))
      )}
      <button
        onClick={() => navigate("/Home")}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default RecentUpdates;