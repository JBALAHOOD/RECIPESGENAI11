
import React from 'react';

const ChefHatIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    strokeWidth="2" 
    stroke="currentColor" 
    fill="none" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 3c1.932 0 3.5 1.568 3.5 3.5s-1.568 3.5 -3.5 3.5s-3.5 -1.568 -3.5 -3.5s1.568 -3.5 3.5 -3.5z"></path>
    <path d="M18.5 10c1.932 0 3.5 1.568 3.5 3.5s-1.568 3.5 -3.5 3.5h-13c-1.932 0 -3.5 -1.568 -3.5 -3.5s1.568 -3.5 3.5 -3.5"></path>
    <path d="M18.5 10a3.5 3.5 0 0 0 -3.5 -3.5h-6a3.5 3.5 0 0 0 -3.5 3.5"></path>
    <path d="M5.5 17h13v4h-13z"></path>
  </svg>
);

export default ChefHatIcon;
