// user-frontend/src/FloatingContact.tsx
import React, { useState } from 'react';

const PHONE_NUMBER = '+917411243463';
const WHATSAPP_LINK = `https://wa.me/${PHONE_NUMBER.replace(/\s/g, '')}`; 
const WHATSAPP_ICON_SRC = '/images/whatsapp_icon.svg'; 

const FloatingContact: React.FC = () => {
  const [showPhone, setShowPhone] = useState(false);
  const [showWhatsappChat, setShowWhatsappChat] = useState(false); // New state for chat pop-out

  return (
    <div className="md:hidden"> 
      
      {/* --- 1. WHATSAPP BUTTON (Fixed Left, Bottom Aligned) --- */}
      <div className="fixed left-3 bottom-8 z-50"> 
        <div className="relative">
          {/* WhatsApp Icon (The trigger - FIXED SIZE) */}
          <button 
            type="button" 
            onClick={() => setShowWhatsappChat(!showWhatsappChat)}
            className="p-3 bg-green-600 rounded-full shadow-2xl transition duration-200 hover:bg-green-700 relative z-20 w-14 h-14 flex items-center justify-center"
          >
            <img src={WHATSAPP_ICON_SRC} alt="WhatsApp" className="w-7 h-7" />
          </button>
          
          {/* --- NEW: WhatsApp Chat Pop-Out Box (ENHANCED STYLING) --- */}
          {showWhatsappChat && (
            <div 
              // Removed absolute positioning from the close button's container
              className="absolute bottom-full left-0 mb-3 w-60 bg-white rounded-xl shadow-lg p-4 text-center transform origin-bottom-left animate-chat-pop-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CRITICAL FIX: Close button is now inside the main div */}
              <div className="flex justify-between items-start mb-3">
                <p className="text-gray-900 text-md font-bold">For Booking & Help!</p>
                <button
                  onClick={() => setShowWhatsappChat(false)}
                  // Style the button to be small and discreet
                  className="text-gray-500 hover:text-gray-800 transition duration-150 p-0"
                  style={{ lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-600 text-xs mb-4 text-left">Chat with us directly on WhatsApp for support or bookings.</p>
              
              <a 
                href={WHATSAPP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setShowWhatsappChat(false)}
                className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 transition w-full"
              >
                <img src={WHATSAPP_ICON_SRC} alt="WhatsApp" className="w-4 h-4 mr-2" />
                Start Chat Now
              </a>
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