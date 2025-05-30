import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaReply, FaThumbsUp, FaRegComment, FaUserCircle } from "react-icons/fa";

const ForumPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [discussions, setDiscussions] = useState([
    { 
      id: 1, 
      title: "How to find a lost item?", 
      author: "Kevin", 
      date: "2 hours ago",
      content: "I recently lost my wallet on campus. What are the best steps to take to increase my chances of finding it? Should I report to campus security first or check the lost and found offices?",
      replies: 5,
      likes: 12,
      comments: [
        { id: 1, author: "Sarah", content: "Always check with campus security first!", date: "1 hour ago", likes: 3 },
        { id: 2, author: "Mike", content: "Post on the university Facebook groups too.", date: "45 mins ago", likes: 5 }
      ]
    },
    { 
      id: 2, 
      title: "Best ways to secure your valuables", 
      author: "Gopika", 
      date: "1 day ago",
      content: "With the increasing number of lost item reports, I thought we could share tips on how to better secure our belongings. What methods have worked for you?",
      replies: 3,
      likes: 8,
      comments: [
        { id: 1, author: "Alex", content: "I use Tile trackers for my keys and wallet.", date: "22 hours ago", likes: 2 }
      ]
    },
    { 
      id: 3, 
      title: "Lost my phone, what should I do?", 
      author: "Cinol", 
      date: "3 days ago",
      content: "I think I left my phone in the library yesterday. I've tried calling it but it goes straight to voicemail. What other steps can I take?",
      replies: 7,
      likes: 15,
      comments: [
        { id: 1, author: "Taylor", content: "Use Find My Device if you have Android!", date: "3 days ago", likes: 7 },
        { id: 2, author: "Jordan", content: "Check with all library desks - sometimes staff collect lost items.", date: "2 days ago", likes: 4 }
      ]
    },
    { 
      id: 4, 
      title: "Anyone found a black wallet near downtown?", 
      author: "Xavier", 
      date: "5 days ago",
      content: "Lost my black leather wallet near the downtown campus yesterday. Contains my student ID and some cash. Reward offered for its return!",
      replies: 2,
      likes: 5,
      comments: [
        { id: 1, author: "Riley", content: "I saw a post about a found wallet at the coffee shop near downtown.", date: "4 days ago", likes: 1 }
      ]
    },
  ]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    setIsDarkMode(storedTheme === "true");
  }, []);

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === activePost) {
        return {
          ...discussion,
          comments: [
            ...discussion.comments,
            {
              id: Math.max(...discussion.comments.map(c => c.id)) + 1,
              author: "You",
              content: newComment,
              date: "Just now",
              likes: 0
            }
          ],
          replies: discussion.replies + 1
        };
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
    setNewComment("");
  };

  const handleLike = (postId, commentId = null) => {
    const updatedDiscussions = discussions.map(discussion => {
      if (discussion.id === postId) {
        if (commentId === null) {
          return { ...discussion, likes: discussion.likes + 1 };
        } else {
          return {
            ...discussion,
            comments: discussion.comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 };
              }
              return comment;
            })
          };
        }
      }
      return discussion;
    });

    setDiscussions(updatedDiscussions);
  };

  const darkClass = isDarkMode ? "dark" : "";

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 to-white text-gray-900"} p-4 transition-colors duration-500`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>Community Forum</h1>
          <button
            onClick={() => navigate("/Home")}
            className={`${isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"} font-medium`}
          >
            ← Back to Home
          </button>
        </div>
        <div className={`rounded-xl shadow-md p-6 mb-6 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FaSearch className={`absolute left-3 top-3 ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Search discussions..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"
                }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className={`px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap ${
                isDarkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
              }`}
              onClick={() => setActivePost("new")}
            >
              Create New Post
            </button>
          </div>
        </div>
        {!activePost && (
          <div className="space-y-4">
            {filteredDiscussions.length > 0 ? (
              filteredDiscussions.map((discussion) => (
                <div 
                  key={discussion.id} 
                  className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                  }`}
                  onClick={() => setActivePost(discussion.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className={`text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-800"}`}>{discussion.title}</h2>
                    </div>
                    <p className={`mt-2 line-clamp-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{discussion.content}</p>
                    <div className={`flex justify-between items-center mt-4 text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      <div className="flex items-center">
                        <FaUserCircle className="mr-1" />
                        <span>{discussion.author}</span>
                        <span className="mx-2">•</span>
                        <span>{discussion.date}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <FaThumbsUp className="mr-1 text-blue-500" />
                          <span>{discussion.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <FaRegComment className="mr-1 text-blue-500" />
                          <span>{discussion.replies}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`rounded-xl shadow-md p-8 text-center ${
                isDarkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-500"
              }`}>
                <p>No discussions found matching your search.</p>
              </div>
            )}
          </div>
        )}
        {activePost && activePost !== "new" && (
          <div className={`rounded-xl shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            {discussions.filter(d => d.id === activePost).map(discussion => (
              <div key={discussion.id}>
                <div className="p-6">
                  <button 
                    onClick={() => setActivePost(null)}
                    className={`font-medium mb-4 ${
                      isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    ← Back to discussions
                  </button>
                  
                  <h1 className={`text-2xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}>{discussion.title}</h1>
                  <div className={`flex items-center text-sm mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    <FaUserCircle className="mr-1" />
                    <span className="font-medium">{discussion.author}</span>
                    <span className="mx-2">•</span>
                    <span>{discussion.date}</span>
                  </div>
                  
                  <p className={`mb-6 whitespace-pre-line ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}>{discussion.content}</p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <button 
                      className={`flex items-center ${
                        isDarkMode ? "text-gray-400 hover:text-blue-400" : "text-gray-600 hover:text-blue-600"
                      }`}
                      onClick={() => handleLike(discussion.id)}
                    >
                      <FaThumbsUp className="mr-1" />
                      <span>Like ({discussion.likes})</span>
                    </button>
                    <div className={`flex items-center ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                      <FaRegComment className="mr-1" />
                      <span>{discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {discussion.comments.map(comment => (
                      <div key={comment.id} className={`pl-4 border-l-2 ${
                        isDarkMode ? "border-blue-700" : "border-blue-200"
                      }`}>
                        <div className={`flex items-center text-sm mb-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                          <FaUserCircle className="mr-1" />
                          <span className="font-medium">{comment.author}</span>
                          <span className="mx-2">•</span>
                          <span>{comment.date}</span>
                        </div>
                        <p className={`mb-2 whitespace-pre-line ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>{comment.content}</p>
                        <button 
                          className={`flex items-center text-xs ${
                            isDarkMode ? "text-gray-500 hover:text-blue-400" : "text-gray-500 hover:text-blue-600"
                          }`}
                          onClick={() => handleLike(discussion.id, comment.id)}
                        >
                          <FaThumbsUp className="mr-1" />
                          <span>Like ({comment.likes})</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className={`text-lg font-medium mb-3 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}>Add your comment</h3>
                    <textarea
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2 ${
                        isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                      }`}
                      rows="3"
                      placeholder="Write your reply..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className={`px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium ${
                        isDarkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
                      }`}
                      onClick={handleAddComment}
                    >
                      <FaReply className="inline mr-1" /> Post Comment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activePost === "new" && (
          <div className={`rounded-xl shadow-md overflow-hidden p-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <button 
              onClick={() => setActivePost(null)}
              className={`font-medium mb-4 ${
                isDarkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
              }`}
            >
              ← Back to discussions
            </button>
            
            <h2 className={`text-xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}>Create New Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className={`block font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>Title</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                  }`}
                  placeholder="What's your question or topic?"
                />
              </div>
              
              <div>
                <label className={`block font-medium mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}>Content</label>
                <textarea
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"
                  }`}
                  rows="5"
                  placeholder="Provide details about what you want to discuss..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActivePost(null)}
                  className={`px-4 py-2 border rounded-lg hover:bg-gray-700 transition ${
                    isDarkMode ? "border-gray-600 text-white" : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  className={`px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium ${
                    isDarkMode ? "bg-blue-700 text-white" : "bg-blue-600 text-white"
                  }`}
                >
                  Post Discussion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumPage;