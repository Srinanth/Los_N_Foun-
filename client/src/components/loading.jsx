import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoadingScreen = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const targetRoute = location.state?.target || '/';
    const timer = setTimeout(() => {
      navigate(targetRoute);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  return (
    <div
      className={`flex items-center justify-center h-screen w-full transition-all duration-500 ${
        isDarkMode ? 'bg-black text-blue-400' : 'bg-white text-blue-600'
      }`}
    >
      <h1 className="text-4xl font-bold animate-pulse scale-110 transition-all duration-700">
        Return<span className="animate-bounce inline-block">It</span>
      </h1>
    </div>
  );
};

export default LoadingScreen;
