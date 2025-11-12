// user-frontend/src/FloatingContact.tsx
import React, { useState } from 'react';

// Your official contact number
const PHONE_NUMBER = '+917411243463';
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, '')}`; 
const WHATSAPP_ICON_SRC = '/images/whatsapp-icon.svg'; 

const FloatingContact: React.FC = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showWhatsappText, setShowWhatsappText] = useState(false);

  return (
    <div className="md:hidden"> 
      
      {/* --- 1. WHATSAPP BUTTON (Fixed Left, Bottom Aligned) --- */}
      <div className="fixed left-3 bottom-8 z-50"> {/* FIX: Positioned at the bottom */}
        <div 
          className="flex items-center cursor-pointer"
          onClick={() => setShowWhatsappText(!showWhatsappText)}
        >
          {/* WhatsApp Icon (The trigger - FIXED SIZE) */}
          <button 
            type="button" 
            // FIX: Explicit size w-14 h-14
            className="p-3 bg-green-600 rounded-full shadow-2xl transition duration-200 hover:bg-green-700 relative z-20 w-14 h-14 flex items-center justify-center"
          >
            <img src={WHATSAPP_ICON_SRC} alt="WhatsApp" className="w-7 h-7" />
          </button>
          
          {/* Slide-out Text (The actual link) - Slides RIGHT into view */}
          {showWhatsappText && (
            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              // FIX: Fully rounded and uses slightly lighter background for contrast
              className="px-4 py-3 bg-green-500 text-white font-semibold rounded-full rounded-l-none transition-all duration-300 ease-in-out whitespace-nowrap shadow-lg hover:bg-green-600 absolute left-full top-0"
              onClick={(e) => { e.stopPropagation(); setShowWhatsappText(false); }} 
            >
              Open WhatsApp to Chat
            </a>
          )}
        </div>
      </div>

      {/* --- 2. CALL BUTTON (Fixed Right, Bottom Aligned) --- */}
      <div className="fixed right-3 bottom-8 z-50"> {/* FIX: Positioned at the bottom */}
        <div className="flex items-center">
          
          {/* Phone Number Popup (The display only) */}
          <a
            href={`tel:${PHONE_NUMBER}`}
            className={`px-4 py-3 ml-2 bg-gray-900 text-white font-semibold rounded-full rounded-l-none transition-all duration-300 ease-in-out whitespace-nowrap shadow-lg hover:bg-gray-800 ${
              showPhone ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            Call Now: {PHONE_NUMBER}
          </a>

          {/* Call Icon (Triggers the showPhone state - FIXED SIZE) */}
          <button 
            onClick={() => setShowPhone(!showPhone)} // Toggle visibility on click
            // FIX: Explicit size w-14 h-14
            className="p-4 bg-red-600 text-white text-3xl rounded-full shadow-2xl transition duration-200 hover:bg-red-700 w-14 h-14 flex items-center justify-center"
          >
            📞
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingContact;