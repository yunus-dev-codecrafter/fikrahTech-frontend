import React from 'react';

const LoadingSkeleton = ({ type = 'card', className = '' }) => {
  const baseClasses = 'animate-pulse-glow bg-surface-200 rounded-lg';
  
  const typeClasses = {
    card: 'h-32 w-full',
    text: 'h-4 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-20',
    line: 'h-2 w-full'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-surface-200 via-surface-100 to-surface-200 bg-[length:200%_100%] bg-[size:200%_100%]"></div>
    </div>
  );
};

export default LoadingSkeleton;
