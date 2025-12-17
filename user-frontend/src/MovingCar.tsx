// // user-frontend/src/MovingCar.tsx
// import React, { useState, useEffect, useRef } from 'react';

// // --- 1. Helper Hook: Gets an element's position ---
// function useElementPosition(elementId: string) {
//   const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       const el = document.getElementById(elementId);
//       if (el) {
//         const rect = el.getBoundingClientRect();
//         setPosition({
//           x: rect.left + rect.width,
//           y: rect.top + rect.height / 2,
//         });
//       }
//     }, 100); 
    
//     return () => clearTimeout(timer);
//   }, [elementId]);

//   return position;
// }

// // --- 2. The Main Car Component (UPDATED with correct park logic) ---
// const MovingCar: React.FC = () => {
//   const logoPosition = useElementPosition('main-logo');
  
//   const [style, setStyle] = useState({ 
//     x: -100, y: 0, rotate: 0, scaleX: 1,
//     transition: 'transform 0.7s ease-out'
//   });
  
//   const styleRef = useRef(style);
//   const carRef = useRef<HTMLImageElement>(null);
//   const parkTimer = useRef<number | null>(null);

//   // Keep the ref in sync with the state
//   useEffect(() => {
//     styleRef.current = style;
//   }, [style]);

//   // Effect to set the car's initial "home" position
//   useEffect(() => {
//     if (logoPosition) {
//       setStyle(prevStyle => {
//         if (prevStyle.x === -100) {
//           return {
//             ...prevStyle,
//             x: logoPosition.x,
//             y: logoPosition.y,
//             transition: 'transform 0.2s ease-out'
//           };
//         }
//         return prevStyle;
//       });
//       setTimeout(() => setStyle(prev => ({...prev, transition: 'transform 0.7s ease-out'})), 200);
//     }
//   }, [logoPosition]);

//   // This effect listens for clicks (runs only once on mount)
//   useEffect(() => {
//     const handleDocumentClick = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (target.closest('a, button, input, select, .react-datepicker__day')) {
//         return;
//       }
      
//       if (parkTimer.current) {
//         clearTimeout(parkTimer.current);
//       }

//       const carWidth = carRef.current ? carRef.current.offsetWidth / 2 : 25;
//       const carHeight = carRef.current ? carRef.current.offsetHeight / 2 : 15;

//       const currentX = styleRef.current.x;
//       const currentY = styleRef.current.y;
//       const targetX = e.clientX - carWidth;
//       const targetY = e.clientY - carHeight;

//       // --- Rotation Logic ---
//       const deltaX = targetX - currentX;
//       const deltaY = targetY - currentY;
//       const rawAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
//       const isMovingLeft = Math.abs(rawAngle) > 90;
//       const newScaleX = isMovingLeft ? -1 : 1; // -1 for left, 1 for right
//       const adjustedAngle = isMovingLeft ? rawAngle + (rawAngle > 0 ? -180 : 180) : rawAngle;
//       const snappedAngle = Math.round(adjustedAngle / 45) * 45;
//       // --- End Rotation Logic ---

//       // 1. INSTANTLY rotate the car
//       setStyle(prev => ({
//         ...prev,
//         rotate: snappedAngle,
//         scaleX: newScaleX,
//         transition: 'transform 0.2s ease-out'
//       }));

//       // 2. AFTER rotating, start the DRIVE
//       setTimeout(() => {
//         setStyle(prev => ({
//           ...prev,
//           x: targetX,
//           y: targetY,
//           transition: 'transform 0.7s ease-out'
//         }));
//       }, 200);

//       // 3. AFTER arriving, start the PARK
//       parkTimer.current = window.setTimeout(() => {
//         setStyle(prev => ({
//           ...prev, // Keep the X, Y, and scaleX
//           rotate: 0,   // Reset rotation to straight
//           // CRITICAL FIX: We DO NOT reset scaleX to 1 here.
//           // This keeps the car flipped to the left if it drove left.
//           transition: 'transform 0.3s ease-out'
//         }));
//       }, 900); // 200ms + 700ms
//     };

//     document.addEventListener('click', handleDocumentClick);
    
//     return () => {
//       document.removeEventListener('click', handleDocumentClick);
//       if (parkTimer.current) {
//         clearTimeout(parkTimer.current);
//       }
//     };
//   }, []); // Runs only ONCE

//   return (
//     <img
//       ref={carRef}
//       src="/car.gif" 
//       alt="Vroom"
//       style={{
//         position: 'fixed',
//         left: 0,
//         top: 0,
//         width: '50px',
//         height: 'auto',
//         zIndex: 9999,
//         pointerEvents: 'none',
//         transform: `
//           translateX(${style.x}px) 
//           translateY(${style.y}px) 
//           rotate(${style.rotate}deg) 
//           scaleX(${style.scaleX})
//         `,
//         transition: style.transition,
//       }}
//     />
//   );
// };

// export default MovingCar;