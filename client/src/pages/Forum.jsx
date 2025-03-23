import React from "react";
import { useNavigate } from "react-router-dom";

const ForumPage = () => {
  const navigate = useNavigate();

  const discussions = [
    { id: 1, title: "How to find a lost item?", author: "Kevin", replies: 5 },
    { id: 2, title: "Best ways to secure your valuables", author: "Gopika", replies: 3 },
    { id: 3, title: "Lost my phone, what should I do?", author: "Cinol", replies: 7 },
    { id: 4, title: "Anyone found a black wallet near downtown?", author: "Xavier", replies: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Community Forum</h1>
        <button
          onClick={() => navigate("/Home")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>

      {/* Forum Content */}
      <div className="w-full max-w-4xl mt-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-full">
            Create New Post
          </button>
        </div>

        {/* Discussions List */}
        <div className="mt-4">
          {discussions.map((discussion) => (
            <div key={discussion.id} className="bg-white p-4 mt-2 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{discussion.title}</h2>
                <p className="text-sm text-gray-600">By {discussion.author} • {discussion.replies} replies</p>
              </div>
              <button className="text-blue-500 hover:underline">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
