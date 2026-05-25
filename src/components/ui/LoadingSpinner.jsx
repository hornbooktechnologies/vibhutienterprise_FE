import React from 'react';

const LoadingSpinner = ({ size = "md", color = "primary" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const colorClasses = {
    primary: "border-primary-500",
    white: "border-white",
    slate: "border-slate-400",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size] || sizeClasses.md} ${colorClasses[color] || colorClasses.primary}`}
      />
    </div>
  );
};

export default LoadingSpinner;
