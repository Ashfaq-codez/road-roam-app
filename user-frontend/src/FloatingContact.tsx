// user-frontend/src/FloatingContact.tsx
import React, { useState } from 'react';

const PHONE_NUMBER = '+917411243463';
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, '')}`; 
const WHATSAPP_ICON_SRC = '/images/whatsapp-icon.svg'; 

const FloatingContact: React.FC = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showWhatsappChat, setShowWhatsappChat] = useState(false); // New state for chat pop-out

  return (
    <div className="md:hidden"> 
      
      {/* --- 1. WHATSAPP BUTTON (Fixed Left, Bottom Aligned) --- */}
      <div className="fixed left-3 bottom-8 z-50"> 
        <div className="relative"> {/* Use relative for absolute positioning of pop-out */}
          {/* WhatsApp Icon (The trigger - FIXED SIZE) */}
          <button 
            type="button" 
            // Toggle the chat pop-out
            onClick={() => setShowWhatsappChat(!showWhatsappChat)}
            className="p-3 bg-green-600 rounded-full shadow-2xl transition duration-200 hover:bg-green-700 relative z-20 w-14 h-14 flex items-center justify-center"
          >
            <img src={WHATSAPP_ICON_SRC} alt="WhatsApp" className="w-7 h-7" />
          </button>
          
          {/* --- NEW: WhatsApp Chat Pop-Out Box --- */}
          {showWhatsappChat && (
            <div 
              // Positioned absolutely above the button
              className="absolute bottom-full left-0 mb-3 bg-white rounded-xl shadow-lg p-4 text-center transform origin-bottom-left animate-chat-pop-in"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <p className="text-gray-800 text-sm font-semibold mb-2">Chat with us on WhatsApp!</p>
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowWhatsappChat(false)} // Close pop-out after clicking link
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition"
              >
                Start Chat
              </a>
              {/* Close button for the chat pop-out */}
              <button
                onClick={() => setShowWhatsappChat(false)}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800 transition"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- 2. CALL BUTTON (Fixed Right, Bottom Aligned) --- */}
      <div className="fixed right-3 bottom-8 z-50"> 
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