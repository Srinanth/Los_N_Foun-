import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaReply, FaThumbsUp, FaRegComment, FaUserCircle } from "react-icons/fa";

const ForumPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState(null);
  const [newComment, setNewComment] = useState("");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Community Forum</h1>
          <button
            onClick={() => navigate("/Home")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search discussions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium whitespace-nowrap"
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
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setActivePost(discussion.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-semibold text-gray-800">{discussion.title}</h2>
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{discussion.content}</p>
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
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
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-500">No discussions found matching your search.</p>
              </div>
            )}
          </div>
        )}
        {activePost && activePost !== "new" && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {discussions.filter(d => d.id === activePost).map(discussion => (
              <div key={discussion.id}>
                <div className="p-6">
                  <button 
                    onClick={() => setActivePost(null)}
                    className="text-blue-600 hover:text-blue-800 font-medium mb-4"
                  >
                    ← Back to discussions
                  </button>
                  
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{discussion.title}</h1>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <FaUserCircle className="mr-1" />
                    <span className="font-medium">{discussion.author}</span>
                    <span className="mx-2">•</span>
                    <span>{discussion.date}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-6 whitespace-pre-line">{discussion.content}</p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <button 
                      className="flex items-center text-gray-600 hover:text-blue-600"
                      onClick={() => handleLike(discussion.id)}
                    >
                      <FaThumbsUp className="mr-1" />
                      <span>Like ({discussion.likes})</span>
                    </button>
                    <div className="flex items-center text-gray-600">
                      <FaRegComment className="mr-1" />
                      <span>{discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {discussion.comments.map(comment => (
                      <div key={comment.id} className="pl-4 border-l-2 border-blue-200">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <FaUserCircle className="mr-1" />
                          <span className="font-medium">{comment.author}</span>
                          <span className="mx-2">•</span>
                          <span>{comment.date}</span>
                        </div>
                        <p className="text-gray-700 mb-2 whitespace-pre-line">{comment.content}</p>
                        <button 
                          className="flex items-center text-xs text-gray-500 hover:text-blue-600"
                          onClick={() => handleLike(discussion.id, comment.id)}
                        >
                          <FaThumbsUp className="mr-1" />
                          <span>Like ({comment.likes})</span>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Add your comment</h3>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                      rows="3"
                      placeholder="Write your reply..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <button 
              onClick={() => setActivePost(null)}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              ← Back to discussions
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What's your question or topic?"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Content</label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="5"
                  placeholder="Provide details about what you want to discuss..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActivePost(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
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