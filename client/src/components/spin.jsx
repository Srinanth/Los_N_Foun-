import React from 'react';

const Spinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-14 h-14 border-6',
  };

  const colorClasses = {
    blue: 'border-blue-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const selectedSizeClass = sizeClasses[size] || sizeClasses.md;
  const selectedColorClass = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`animate-spin rounded-full ${selectedSizeClass} ${selectedColorClass} border-solid`}></div>
  );
};

export default Spinner;