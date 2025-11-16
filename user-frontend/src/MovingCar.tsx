// user-frontend/src/MovingCar.tsx
import React, { useState, useEffect, useRef } from 'react';

// --- 1. Helper Hook: Gets an element's position ---
// We need this to find where the logo is on the screen.
function useElementPosition(elementId: string) {
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const el = document.getElementById(elementId);
    if (el) {
      const rect = el.getBoundingClientRect();
      // Get position relative to the viewport
      setPosition({
        x: rect.left + rect.width, // Position to the right of the element
        y: rect.top + rect.height / 2, // Position in the middle vertically
      });
    }
  }, [elementId]);

  return position;
}

// --- 2. The Main Car Component ---
const MovingCar: React.FC = () => {
  // Find the logo's position to use as our "home"
  const logoPosition = useElementPosition('main-logo');
  
  // This state holds the car's *current* position
  const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
  
  // This ref holds the car element to get its size
  const carRef = useRef<HTMLImageElement>(null);

  // This effect sets the car's initial position once the logo is found
  useEffect(() => {
    if (logoPosition && !position) {
      setPosition(logoPosition);
    }
  }, [logoPosition, position]);

  // This effect listens for clicks
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't move if clicking on a button, link, or input
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, select')) {
        return;
      }
      
      // Get the car's size (so we can center it on the cursor)
      const carWidth = carRef.current ? carRef.current.offsetWidth / 2 : 25;
      const carHeight = carRef.current ? carRef.current.offsetHeight / 2 : 15;

      // Set the car's new target position
      setPosition({ 
        x: e.clientX - carWidth, 
        y: e.clientY - carHeight 
      });
    };

    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, []); // Empty dependency array, so it only runs once

  return (
    <img
      ref={carRef}
      src="/images/car.gif" 
      alt="Vroom"
      style={{
        position: 'fixed',
        left: 0, // We control position with transform for smoother animation
        top: 0,
        width: '50px',
        height: 'auto',
        zIndex: 9999,
        pointerEvents: 'none',

        // --- The Animation Magic ---
        // 1. Move the car using 'transform'
        transform: position ? `translateX(${position.x}px) translateY(${position.y}px)` : 'translateX(-100px)', // Start off-screen
        // 2. Animate the 'transform' property over 0.7 seconds
        transition: 'transform 0.8s ease-out', 
      }}
    />
  );
};

export default MovingCar;