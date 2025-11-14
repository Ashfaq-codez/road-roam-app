// user-frontend/src/ScrollToTopButton.tsx
// This component manages its own state internally and takes NO props.

import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC<{ isVisible: boolean }> = ({  }) => { // Correct component signature (no props)
  const [isVisible, setIsVisible] = useState(false); // Internal state

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Function to determine when the button should be visible (past 200px and 25% depth)
  const toggleVisibility = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = window.pageYOffset / totalHeight;

    // Show button if scrolled past 200px AND past 25% of the content depth
    if (window.pageYOffset > 200 && scrollDepth > 0.25) { 
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Add scroll listener
    window.addEventListener('scroll', toggleVisibility);
    // Run initial check on mount
    toggleVisibility(); 
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <button
      onClick={scrollToTop}
      // CRITICAL FIX: Visibility driven by internal state (isVisible)
      className={`fixed bottom-24 right-2 z-40 p-2.5 bg-red-600 text-white rounded-full shadow-2xl transition-opacity duration-300 transform hover:scale-110 ${
        isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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