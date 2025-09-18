import React from 'react';

const BookmarkIcon: React.FC<{ className?: string; isFilled?: boolean }> = ({ className = "w-5 h-5", isFilled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill={isFilled ? 'currentColor' : 'none'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M9 4h6a2 2 0 0 1 2 2v14l-5 -3l-5 3v-14a2 2 0 0 1 2 -2"></path>
  </svg>
);

export default BookmarkIcon;
