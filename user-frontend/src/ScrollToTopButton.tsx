// user-frontend/src/ScrollToTopButton.tsx
// This component manages its own state internally and takes NO props.

import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => { // Removed prop type here
  const [showButton, setShowButton] = useState(false); // Internal state

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleVisibility = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = window.pageYOffset / totalHeight;

    if (window.pageYOffset > 200 && scrollDepth > 0.25) { 
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    toggleVisibility(); 
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      // CRITICAL FIX: Visibility driven by internal state
      className={`fixed bottom-24 right-3 z-40 p-2.5 bg-red-600 text-white rounded-full shadow-2xl transition-opacity duration-300 transform hover:scale-110 ${
        showButton ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;