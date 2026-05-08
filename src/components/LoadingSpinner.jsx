import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'text-blue-600' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const borderSizeClasses = {
    sm: 'border-b-2',
    md: 'border-b-2',
    lg: 'border-b-2',
    xl: 'border-b-4'
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`
          animate-spin rounded-full 
          ${sizeClasses[size]} 
          ${borderSizeClasses[size]} 
          ${color}
        `}
      ></div>
    </div>
  );
};

export default LoadingSpinner;