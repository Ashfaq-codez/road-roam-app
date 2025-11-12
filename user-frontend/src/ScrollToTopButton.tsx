// user-frontend/src/ScrollToTopButton.tsx

import React from 'react'; // Remove useState, useEffect

const ScrollToTopButton: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  
  // Function to scroll to the top of the page smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      // CRITICAL FIX: Visibility controlled by isVisible prop
      className={`fixed bottom-24 right-3 z-40 p-2.5 bg-red-600 text-white rounded-full shadow-2xl transition-opacity duration-300 transform hover:scale-110 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      {/* Up Arrow Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;