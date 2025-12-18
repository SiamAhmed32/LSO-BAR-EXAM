"use client";

import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`${sizeClasses[size]} border-primaryColor/20 border-t-primaryColor rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;

