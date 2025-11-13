// user-frontend/src/LandingPageComponents.tsx

import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';

// import { useInView } from 'react-intersection-observer';

// --- 1. Header Component (Updated with Sub-Logo) ---
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        
        {/* NEW LOGO STRUCTURE (FIXED: Alignment) */}
        <Link to="/" className="flex flex-col h-10 -space-y-1 z-50">
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
        </Link>
        
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
    className="absolute inset-0 bg-cover bg-center blur-[3px] scale-105"
    style={{ backgroundImage: "url('/images/roadroam.avif')" }}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/30 to-black/80"></div>
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


// --- NEW HELPER: FeatureCard (for Zig-Zag Layout) ---
interface FeatureCardProps {
  imgSrc: string;
  title: string;
  description: string;
  // This prop reverses the layout
  reverse?: boolean; 
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imgSrc, title, description, reverse = false }) => {
  // Define the order of columns. 'reverse' flips them.
  const imageOrder = reverse ? 'md:order-last' : 'md:order-first';
  const textOrder = reverse ? 'md:order-first' : 'md:order-last';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      
      {/* 1. Image Column */}
      <div className={`w-full h-80 rounded-xl overflow-hidden shadow-2xl ${imageOrder}`}>
        <img 
          src={imgSrc} 
          alt={title} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ease-in-out" 
        />
      </div>
      
      {/* 2. Text Column */}
      <div className={`w-full ${textOrder}`}>
        <h3 className="text-3xl font-bold text-red-600 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};


// --- UPDATED: About Us Section (Zig-Zag Layout) ---
export const AboutUs = () => (
  <section id="about" className="bg-white px-6 py-20 shadow-inner">
    <div className="container mx-auto max-w-6xl"> {/* Made container wider */}
      <h2 className="text-[47px] font-extrabold text-center text-gray-900 mb-16 border-b pb-4">
        Why Choose <span className="text-red-600">Road Roam</span>?
      </h2>
      
      {/* A container for all our feature rows */}
      <div className="space-y-20">
        
        {/* Row 1: Safety (Image Left, Text Right) */}
        <FeatureCard 
          imgSrc="/images/certified.webp" 
          title="Certified Safety & Tracking" 
          description="All vehicles are equipped with real-time GPS tracking. We prioritize the safety of women and solo travelers with 24/7 monitoring."
        />
        
        {/* Row 2: Chauffeur (Text Left, Image Right) */}
        <FeatureCard 
          imgSrc="/images/chauffeur.webp" 
          title="Expert Chauffeur Driven" 
          description="Travel stress-free with our vetted, professional drivers. Focus on your journey while we handle the traffic and navigation."
          reverse={true} // This flips the layout
        />
        
        {/* Row 3: Value (Image Left, Text Right) */}
        <FeatureCard 
          imgSrc="/images/rupee.webp" 
          title="Best Value Guaranteed" 
          description="Premium, well-maintained cars at the most competitive rates in the market. Get the best possible service without overpaying."
        />

        {/* Row 4: Support (Text Left, Image Right) */}
        <FeatureCard 
          imgSrc="/images/support.webp" 
          title="24/7 Customer Support" 
          description="Our Team is available for any sort of doubt and support related to your car rental, we are available on WhatsApp, Sms and Call +91 7411243463 "
          reverse={true} // This flips the layout
        />
        
      </div>
      
      <p className="mt-20 font-bold text-center text-[25px] text-gray-700 border-t pt-8">
          Easy to Avail, transparent pricing, and quality vehicles for a truly reliable rental experience.
      </p>
    </div>
  </section>
);


// --- 3. Services Component ---
export const Services = () => (
  <section id="services" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-200 mb-12">Our <span className="text-red-600">Chauffeur</span> Services</h2>
    
    {/* CRITICAL FIX: Use a 3-column grid for the dynamic layout */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* Row 1 */}
      <ServiceCard 
        title="Airport Transfers" 
        description="Reliable, on-time pickups and drops to Kempegowda International Airport." 
        className="md:col-span-1" // Square
      />
      <ServiceCard 
        title="City Cruise" 
        description="Explore Bangalore at your own pace. Perfect for sightseeing, shopping, or business meetings." 
        className="md:col-span-2" // Rectangle
      />
      
      {/* Row 2 */}
      <ServiceCard 
        title="Tours & Trips" 
        description="Plan your weekend getaway. We cover all major destinations from Bangalore." 
        className="md:col-span-2" // Rectangle
      />
      <ServiceCard 
        title="Corporate Rentals" 
        description="Premium vehicles and professional chauffeurs for your business needs." 
        className="md:col-span-1" // Square
      />

      {/* Row 3 (Optional) - You can add more cards here */}
      <ServiceCard 
        title="Event Rentals" 
        description="Premium vehicles and professional chauffeurs for your Event needs." 
        className="md:col-span-3" // Full-width Rectangle
      />
    </div>
  </section>
);


// Helper for Service Card (Updated to accept className)
const ServiceCard: React.FC<{title: string, description: string, className?: string}> = ({ title, description, className = '' }) => (
  <div 
    // CRITICAL FIX: Added h-full and applied the passed-in className
    className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 
               transform transition-all duration-300 ease-in-out 
               hover:shadow-2xl hover:scale-[1.02] hover:border-red-500 cursor-pointer
               h-full ${className}`} // Ensures cards in a row are same height
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
          imgSrc="/images/hycross.webp" 
        />
        <FleetCard 
          name="Crysta" 
          description="Arrive in style. Our luxury fleet is available for the journey." 
          imgSrc="/images/crysta.webp" 
        />
        <FleetCard 
          name="Innova" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="/images/innova.webp" 
        />
        <FleetCard 
          name="Ertiga" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="/images/ertiga.webp" 
        />

        <FleetCard 
          name="Ciaz" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="/images/ciaz.webp" 
        />
        <FleetCard 
          name="Dzire" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="/images/dzire.webp" 
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

// --- 5. Destinations (Bangalore) Component (UPDATED 2+1 LAYOUT with Image) ---
export const Destinations = () => (
  <section id="destinations" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-4">Explore Bangalore</h2>
    <p className="text-xl text-center text-gray-600 mb-12">Must visit places for your in city cruise.</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DestinationCard 
        name="Bangalore Palace" 
        imgSrc="/images/palace.webp" 
        description="A stunning example of Tudor architecture in the heart of the city, featuring elegant woodcarvings and beautiful gardens."
      />
      {/* The updated "View More" card with Cubbon Park image */}
      <ViewMoreCard imgSrc="/images/a.webp" />

      <DestinationCard 
        name="Lalbagh Botanical Garden" 
        imgSrc="/images/Lalbagh-Bangalore.webp" 
        description="A historic garden with a rare collection of tropical plants, a famous glass house, and a serene lake."
      />
       
    </div>
  </section>
);

// Helper for Destination Card (REVERTED TO CLICK-TO-FLIP)
const DestinationCard: React.FC<{name: string, imgSrc: string, description: string}> = ({ name, imgSrc, description }) => {
  // 1. Add state back to track if the card is flipped
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    // 2. Main container: Sets up the 3D perspective and click/tap handler
    <div 
      className="bg-transparent rounded-xl h-64 w-full [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)} // Toggles state on click/tap
    >
      {/* 3. Inner container: Applies the flip animation based on state */}
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : '' // Flips if isFlipped is true
        }`}
      >
        {/* 4. The Front Side (Image) */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img src={imgSrc} alt={name} className="w-full h-full object-cover rounded-xl shadow-lg" />
          <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
          <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{name}</h3>
        </div>

        {/* 5. The Back Side (Text) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-lg p-6 overflow-auto">
          <h4 className="text-xl font-bold text-red-600 mb-2">{name}</h4>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const ViewMoreCard: React.FC<{ imgSrc: string }> = ({ imgSrc }) => (
  <a 
    href="/destinations" 
    className="relative flex flex-col items-center justify-center rounded-xl shadow-lg h-64 w-full
               transform transition-all duration-300 ease-in-out 
               hover:shadow-2xl hover:scale-[1.02] group overflow-hidden" // Added overflow-hidden
  >
    {/* 1. Background Image (z-0, at the bottom) */}
    {/* No blur, but will zoom on hover */}
    <img 
      src={imgSrc} 
      alt="Explore More Destinations" 
      className="absolute inset-0 w-full h-full object-cover 
                 group-hover:scale-110 transition-transform duration-500 ease-in-out z-0" 
    />
    
    {/* 2. Dark Gradient Overlay (z-10, in the middle) */}
    {/* This provides the dark tint for text readability */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
    
    {/* 3. Content (z-20, on top, stays sharp) */}
    <div className="relative z-20 text-white flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
        →
      </div>
      <h3 className="text-2xl font-bold text-center">View More Places</h3>
      <p className="text-gray-200 text-center">Discover all fun spots</p>
    </div>
  </a>
);

// --- 6. Packages Component (Updated with Red Theme) ---
export const Packages = () => (
  <section id="packages" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-red-600 mb-12">Standard <span className='text-gray-900'>Package</span></h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        
        <PackageCard 
          title="City Cruise" 
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
    <h2 className="text-4xl font-extrabold text-gray-300 mb-8">Get <span className='text-red-600'>in</span> Touch</h2>
    <p className="text-xl text-gray-500 mb-4">Have questions? We're here to help.</p>
    
    {/* FIX: Use 'break-words' and 'text-wrap' to force long URLs/emails to break */}
    <div className='mb-10'>
    <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
      <span className='text-white'>Email: </span> roadroamcarrentals@gmail.com
    </p>
    
    <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
      <span className='text-white'>phone: </span> +91 7411243463
    </p>
    </div>
    <a 
      href="#booking-form" 
      className="inline-block bg-red-600 text-white font-bold py-3 px-10 text-lg rounded-lg shadow-xl 
                 hover:bg-red-700 transition duration-300 transform hover:scale-105"
    >
      Book Now
    </a>
  </section>
);

// --- 8. Footer Component (Updated with new logo structure) ---
export const Footer = () => (
  <footer className="text-center py-8 bg-black">
    
    {/* --- CRITICAL FIX: New Logo Structure --- */}
    <Link to="/" className="flex items-baseline justify-center mb-2">
      <span className="text-2xl font-extrabold text-white">Road</span>
      
      <div className="flex flex-col -ml-0.5">
        <span className="text-2xl font-extrabold text-red-600">Roam</span>
        <span className="text-[9px] font-semibold tracking-tight -mt-1 self-end text-gray-400">
          Car Rentals
        </span>
      </div>
    </Link>
    {/* --- End Logo Structure --- */}

    <p className="text-gray-400 text-sm">A Chauffeured service for your travel needs.</p>
    <p className="text-gray-500 text-xs mt-4">© 2025, Road Roam - Car Rentals. All rights reserved.</p>
  </footer>
);



 