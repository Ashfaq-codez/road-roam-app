// user-frontend/src/LandingPageComponents.tsx
// user-frontend/src/LandingPageComponents.tsx

import React, { useState } from 'react'; 
// import { useInView } from 'react-intersection-observer';

// --- 1. Header Component (Updated with Sub-Logo) ---
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* NEW LOGO STRUCTURE (FIXED: Alignment) */}
        <div className="flex flex-col h-10 -space-y-1 z-50">
          <div className="text-3xl font-extrabold flex">
            
            {/* CRITICAL FIX: Add conditional class here */}
            <span className={isOpen ? 'text-white' : 'text-gray-900'}>Road</span>
            
            {/* Roam (Red) - This part is fine */}
            <span className="text-red-600 relative">Roam</span>
          </div>
          
          {/* Subtext (This alignment is a separate, persistent issue we've been fighting) */}
          <span className="text-gray-600 text-xs font-semibold tracking-tight self-end mr-0.5">
            Car Rentals
          </span>
        </div>
        
        {/* ... (Mobile Menu Button Logic) ... */}
        <button 
          className="md:hidden text-2xl p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* This part must also be conditional for the X icon */}
          <span className={isOpen ? 'text-white' : 'text-gray-800'}>
              {isOpen ? '✕' : '☰'} 
          </span>
        </button>
        
        {/* 2. Desktop Navigation (Visible on md screens and up) */}
        <div className="hidden md:flex space-x-4 items-center">
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#fleet">Our-Fleet</NavLink>
          <NavLink href="#destinations">Around-City</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          
          <a 
            href="#booking-form" 
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* Mobile Dropdown Menu (Overlay) */}
      <div 
        // Overlay is dark (bg-black)
        className={`fixed top-0 left-0 w-full h-full bg-black transition-transform duration-300 transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full' 
        } z-40 p-6`}
        style={{ overflowY: 'auto' }}
      >
        <div className="flex flex-col space-y-6 pt-20">
          <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="#fleet" onClick={() => setIsOpen(false)}>Our Fleet</MobileNavLink>
          <MobileNavLink href="#destinations" onClick={() => setIsOpen(false)}>Around the City</MobileNavLink>
          <MobileNavLink href="#contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
          
          <a 
            href="#booking-form" 
            onClick={() => setIsOpen(false)}
            className="mt-4 bg-red-600 text-white font-bold py-3 px-6 text-center rounded-lg hover:bg-red-700 transition"
          >
            Book Now
          </a>
        </div>
      </div>

    </header>
  );
};

// ... (All other components and helpers remain the same) ...

// --- Helper Components (Remain the same) ---
const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-600 hover:text-red-600 font-medium transition-colors">
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string, onClick: () => void, children: React.ReactNode }> = ({ href, onClick, children }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-white text-3xl font-extrabold hover:text-red-500 transition-colors block border-b border-gray-700 pb-3"
  >
    {children}
  </a>
);

// ... (Rest of LandingPageComponents.tsx remains the same) ...

// --- 2. Hero Component (Adjusted for Mobile Safety) ---
export const Hero = () => (
  <div className="relative min-h-[70vh] py-20 flex items-center justify-center overflow-hidden">
  {/* Blurred Background */}
  <div
    className="absolute inset-0 bg-cover bg-center blur-[2px] scale-105"
    style={{ backgroundImage: "url('/images/main_1.jpg')" }}
  />

    <div className="absolute inset-0 bg-black opacity-60 "></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        Your Journey, Our <span className="text-red-500">Wheels</span>, Explore With Ease.
      </h1>
      <p className="text-xl md:text-2xl font-light mb-8 drop-shadow-md">
        Travel stress-free with Road Roam’s chauffeur-driven rentals
      </p>
      <a 
        href="#booking-form" 
        className="bg-red-600 text-white font-bold py-4 px-10 text-lg rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
      >
        Reserve Your Car Today
      </a>
    </div>
  </div>
);

// --- NEW COMPONENT: About Us Section ---
export const AboutUs = () => (
  <section id="about" className="bg-white px-6 py-20 shadow-inner">
    <div className="container mx-auto max-w-5xl">
      <h2 className="text-[47px] font-extrabold text-center text-gray-900 mb-12 border-b pb-4">
        Why Choose <span className="text-red-600">Road Roam</span>?
      </h2>
      
      {/* Container for the 3 cards (responsive grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        {/* Card 1: Certified Safety & Tracking (Remains ValueCard) */}
        <ValueCard 
          imgSrc="/images/certified.jpg" 
          title="Certified Safety & Tracking" 
          description="All vehicles are equipped with real-time GPS tracking. We prioritize the safety of women and solo travelers with 24/7 monitoring."
        />
        
        {/* CRITICAL FIX: Use the new ChauffeurCard for this entry */}
        <ChauffeurCard 
          imgSrc="/images/chauffeur.png" 
          title="Expert Chauffeur Driven" 
          description="Travel stress-free with our vetted, professional drivers. Focus on your journey while we handle the traffic and navigation."
        />
        
        {/* Card 3: Best Value Guaranteed (Remains ValueCard) */}
        <ValueCard 
          imgSrc="/images/rupee.jpg" // Using the direct Rupee symbol
          title="Best Value Guaranteed" 
          description="Premium, well-maintained cars at the most competitive rates in the market. Get the best possible service without overpaying."
        />

         <ValueCard 
          imgSrc="/images/support.png" // Using the direct 
          title="24/7 Customer Support" 
          description="Our Team is available for any sort of doubt and support relatede to your car rental, we are available on WhatsApp, Sms and Call +91 7411243463 "
        />
        
      </div>
      
      {/* Footer message on quality */}
      <p className="mt-12 font-bold text-center text-[25px] text-gray-700 border-t pt-4">
          Easy to Avail, transparent pricing, and quality vehicles for a truly reliable rental experience.
      </p>
    </div>
  </section>
);
// --- NEW HELPER: Value Card (Final Vertical/Circle Layout) ---
const ValueCard: React.FC<{icon?: string, title: string, description: string, imgSrc?: string}> = ({ title, description, imgSrc }) => (
  // Main Card Wrapper: Ensures it fits nicely in a row
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center w-full transform hover:scale-[1.02] transition duration-300">
    
    {/* CRITICAL FIX: Image/Icon on TOP (using circular image holder) */}
    <div className="flex items-center justify-center mb-4">
      {imgSrc ? (
        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md">
          <img 
            src={imgSrc} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        </div>
      ) : (
        // Icon Styling: Center the icon and use brand colors
        <div className="text-5xl flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full text-red-600">
          
        </div>
      )}
    </div>
    
    {/* Text Content (Bottom) */}
    <div className="p-2 flex flex-col justify-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

// --- NEW COMPONENT: ChauffeurCard (Harmonized Look) ---
interface ChauffeurCardProps {
  imgSrc: string;
  title: string;
  description: string;
}

export const ChauffeurCard: React.FC<ChauffeurCardProps> = ({ imgSrc, title, description }) => (
  // 1. Uniform Card Style: Use the same white background, padding, and shadow as ValueCard
  <div 
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center 
               w-full transform hover:scale-[1.02] transition duration-300"
  >
    {/* Image Section (CRITICAL FIX: Removed h-72 and centered content for better alignment) */}
    <div className="relative h-48 overflow-hidden flex items-center justify-center bg-gray-50 rounded-lg mb-4">
      <img 
        src={imgSrc} 
        alt={title} 
        className="object-cover w-full h-full" 
      />
    </div>
    
    {/* Text Content Section (Bottom Half - Aligned for consistency) */}
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);

// --- 3. Services Component ---
export const Services = () => (
  <section id="services" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-white mb-12">Our <span className="text-red-600">Chauffeur</span> Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      
      <ServiceCard 
        title="Airport Transfers" 
        description="Reliable, on-time pickups and drops to Kempegowda International Airport." 
      />
      <ServiceCard 
        title="City Cruise" 
        description="Explore Bangalore at your own pace. Perfect for sightseeing, shopping, or business meetings." 
      />
      
      <ServiceCard 
        title="Tours & Trips" 
        description="Plan your weekend getaway. We cover all major destinations from Bangalore." 
      />
      <ServiceCard 
        title="Corporate Rentals" 
        description="Premium vehicles and professional chauffeurs for your business needs." 
      />
      <ServiceCard 
        title="Event Rentals" 
        description="Premium vehicles and professional chauffeurs for your Event needs." 
      />
    </div>
  </section>
);


// Helper for Service Card (Updated for Hover Animation)
const ServiceCard: React.FC<{title: string, description: string}> = ({ title, description }) => (
  <div 
    // CRITICAL FIX: Added transform, transition, and hover classes
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 
               transform transition-all duration-300 ease-in-out 
               hover:shadow-2xl hover:scale-[1.02] hover:border-red-500 cursor-pointer"
  >
    <h3 className="text-2xl font-bold text-red-600 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);


// --- 4. Fleet Component ---
export const Fleet = () => (
  <section id="fleet" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-red-600 mb-12"><span className='text-gray-900'>Our</span> Fleet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <FleetCard 
          name="Hycross" 
          description="Arrive in style. Our luxury fleet is available for the journey." 
          imgSrc="/images/hycross.png" 
        />
        <FleetCard 
          name="Crysta" 
          description="Arrive in style. Our luxury fleet is available for the journey." 
          imgSrc="/images/crysta.jpeg" 
        />
        <FleetCard 
          name="Innova" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="/images/innova.jpg" 
        />
        <FleetCard 
          name="Ertiga" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="/images/ertiga.jpeg" 
        />

        <FleetCard 
          name="Ciaz" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="/images/ciaz.png" 
        />
        <FleetCard 
          name="Dzire" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="/images/dzire.jpg" 
        />
            
                
      </div>
    </div>
  </section>
);


// Helper for Fleet Card (Updated for Aspect Ratio)
const FleetCard: React.FC<{name: string, description: string, imgSrc: string}> = ({ name, description, imgSrc }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
    
    {/* CRITICAL FIX: Use padding-top to define a 4:3 landscape ratio */}
    <div className="relative pt-[50%] overflow-hidden">
      <img 
        src={imgSrc} 
        alt={name} 
        // Image now fills the relative container and uses object-cover without cropping vital parts
        className="absolute inset-0 w-full h-full object-cover" 
      />
    </div>
    
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// --- 5. Destinations (Bangalore) Component ---
export const Destinations = () => (
  <section id="destinations" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-4">Explore Bangalore</h2>
    <p className="text-xl text-center text-gray-300 mb-12">Must visit places for your City Cruise.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DestinationCard 
        name="Bangalore Palace" 
        imgSrc="/images/palace.jpg" 
      />
      <DestinationCard 
        name="Lalbagh Botanical Garden" 
        imgSrc="/images/Lalbagh-Bangalore.jpg" 
      />
      <DestinationCard 
        name="Cubbon Park" 
        imgSrc="/images/cubbon-park.jpg" 
      />
    </div>
  </section>
);

// Helper for Destination Card
const DestinationCard: React.FC<{name: string, imgSrc: string}> = ({ name, imgSrc }) => (
  <div className="relative rounded-xl shadow-lg overflow-hidden h-64 group">
    <img src={imgSrc} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300" />
    <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition duration-300"></div>
    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md group-hover:text-red-500 transition-colors">{name}</h3>
  </div>
);

// --- 6. Packages Component (Updated with Red Theme) ---
export const Packages = () => (
  <section id="packages" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-red-600 mb-12">Standard Package</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* <PackageCard 
          title="Half-Day City Tour" 
          details="4 Hours / 40 KMs. Covers 2-3 major spots."
        /> */}
        <PackageCard 
          title="City Rides" 
          // price="₹2,500" 
          details="8 Hours / 80 KMs. Explore all of Bangalore's highlights with our Standard package."
        />
      </div>
    </div>
  </section>
);

// Helper for Package Card (Updated with Red Theme)
const PackageCard: React.FC<{title: string, details: string}> = ({ title, details }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-600 text-center w-full md:w-96 transform hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    {/* <p className="text-4xl font-extrabold text-red-600 mb-4">{price}</p> */}
    <p className="text-gray-600 mb-6">{details}</p>
    <a 
      href="#booking-form" 
      className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition duration-300"
    >
      Book This Package
    </a>
  </div>
);

// --- 7. Contact Component (Updated with Red Theme) ---
// user-frontend/src/LandingPageComponents.tsx (Contact component)

export const Contact = () => (
  <section id="contact" className="container mx-auto px-6 py-20 text-center">
    <h2 className="text-4xl font-extrabold text-gray-300 mb-8">Get in Touch</h2>
    <p className="text-xl text-gray-500 mb-4">Have questions? We're here to help.</p>
    
    {/* FIX: Use 'break-words' and 'text-wrap' to force long URLs/emails to break */}
    <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
      Email: roadroamcarrentals@gmail.com
    </p>
    
    <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
      phone: +91 7411243463
    </p>
  </section>
);

// --- 8. Footer Component (Updated with Red/Black Theme) ---
export const Footer = () => (
  <footer className="text-center py-8 bg-black">
    <div className="text-2xl font-extrabold mb-2">
        <span className="text-white">Road</span>
        <span className="text-red-600">Roam</span>
    </div>
    <p className="text-gray-400 text-sm">A professional service for your travel needs.</p>
    <p className="text-gray-500 text-xs mt-4">© 2025 Road Roam. All rights reserved.</p>
  </footer>
);