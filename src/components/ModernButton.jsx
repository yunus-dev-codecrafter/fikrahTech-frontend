import React from 'react';

const ModernButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false,
  icon 
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300 ease-in-out';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-button',
    secondary: 'bg-surface-200 hover:bg-surface-300 text-surface-900 shadow-button',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-button',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-button',
    ghost: 'bg-transparent hover:bg-surface-100 text-surface-900 border border-surface-300'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : 'micro-interact'}
        ${className}
      `}
    >
      {icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default ModernButton;
