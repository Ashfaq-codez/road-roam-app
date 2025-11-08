// user-frontend/src/LandingPageComponents.tsx
// This file contains all the new sections you requested.

import React, { useState } from 'react'; // <-- useState is needed for the mobile menu

// --- 1. Header Component (Responsive with Hamburger) ---
export const Header = () => {
  // State to control the mobile menu visibility
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo (Always Visible) */}
        <div className="text-3xl font-extrabold z-50">
          <span className="text-black">Road</span>
          <span className="text-red-600">Roam</span>
        </div>
        
        {/* 1. Mobile Menu Button (Visible only on small screens) */}
        <button 
          className="md:hidden text-2xl p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Toggle between hamburger and close icon */}
          {isOpen ? '✕' : '☰'} 
        </button>
        
        {/* 2. Desktop Navigation (Visible on md screens and up) */}
        <div className="hidden md:flex space-x-4 items-center">
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#fleet">Our Fleet</NavLink>
          <NavLink href="#destinations">Destinations</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          
          <a 
            href="#booking-form" 
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* 3. Mobile Dropdown Menu (Conditionally Renders) */}
      <div 
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 transition-transform duration-300 transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full' // Slide in/out transition
        } z-40 p-6`}
        // Ensure the screen doesn't scroll when the menu is open
        style={{ overflowY: 'auto' }}
      >
        <div className="flex flex-col space-y-6 pt-20">
          <MobileNavLink href="#services" onClick={() => setIsOpen(false)}>Services</MobileNavLink>
          <MobileNavLink href="#fleet" onClick={() => setIsOpen(false)}>Our Fleet</MobileNavLink>
          <MobileNavLink href="#destinations" onClick={() => setIsOpen(false)}>Destinations</MobileNavLink>
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

// --- Helper Components ---
// Desktop Link
const NavLink: React.FC<{ href: string, children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-600 hover:text-red-600 font-medium transition-colors">
    {children}
  </a>
);

// Mobile Link (Full width, white text for dark overlay)
const MobileNavLink: React.FC<{ href: string, onClick: () => void, children: React.ReactNode }> = ({ href, onClick, children }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="text-white text-3xl font-extrabold hover:text-red-500 transition-colors block border-b border-gray-700 pb-3"
  >
    {children}
  </a>
);

// --- 2. Hero Component (Adjusted for Mobile Safety) ---
export const Hero = () => (
  <div 
    className="relative min-h-[70vh] py-20 flex items-center justify-center bg-cover bg-center" 
    style={{ backgroundImage: "url('https://ackodrive.com/car-guide/competitors-of-land-rover-defender/')" }}
  >
    <div className="absolute inset-0 bg-black opacity-60"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        Your Journey, Our <span className="text-red-500">Wheels</span>, Explore With Ease.
      </h1>
      <p className="text-xl md:text-2xl font-light mb-8 drop-shadow-md">
        Explore Bangalore and beyond with Road Roam's reliable rental fleet.
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

// --- 3. Services Component ---
export const Services = () => (
  <section id="services" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Our Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <ServiceCard 
        title="In-City Rentals" 
        description="Explore Bangalore at your own pace. Perfect for sightseeing, shopping, or business meetings." 
      />
      <ServiceCard 
        title="Airport Transfers" 
        description="Reliable, on-time pickups and drops to Kempegowda International Airport." 
      />
      <ServiceCard 
        title="Outstation Trips" 
        description="Plan your weekend getaway. We cover all major destinations from Bangalore." 
      />
      <ServiceCard 
        title="Corporate Rentals" 
        description="Premium vehicles and professional chauffeurs for your business needs." 
      />
    </div>
  </section>
);

// Helper for Service Card (Updated with Red Theme)
const ServiceCard: React.FC<{title: string, description: string}> = ({ title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-red-500 transition duration-300">
    <h3 className="text-2xl font-bold text-red-600 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// --- 4. Fleet Component ---
export const Fleet = () => (
  <section id="fleet" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">Our Fleet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FleetCard 
          name="Sedans (Etios, Dzire)" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d36?q=80&w=600&h=400" 
        />
        <FleetCard 
          name="SUVs (Innova, Ertiga)" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="https://images.unsplash.com/photo-1588440787334-b38122c3b246?q=80&w=600&h=400" 
        />
        <FleetCard 
          name="Luxury (BMW, Mercedes)" 
          description="Arrive in style. Our luxury fleet is available for corporate and special events." 
          imgSrc="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600&h=400" 
        />
      </div>
    </div>
  </section>
);

// Helper for Fleet Card
const FleetCard: React.FC<{name: string, description: string, imgSrc: string}> = ({ name, description, imgSrc }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
    <img src={imgSrc} alt={name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// --- 5. Destinations (Bangalore) Component ---
export const Destinations = () => (
  <section id="destinations" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-4">Explore Bangalore</h2>
    <p className="text-xl text-center text-gray-600 mb-12">Must-visit places for your in-city tour.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DestinationCard 
        name="Bangalore Palace" 
        imgSrc="https://images.unsplash.com/photo-1574041355655-27a3c3b52e39?q=80&w=600&h=400" 
      />
      <DestinationCard 
        name="Lalbagh Botanical Garden" 
        imgSrc="https://images.unsplash.com/photo-1600201923483-c2c6a0b4d4f2?q=80&w=600&h=400" 
      />
      <DestinationCard 
        name="Cubbon Park" 
        imgSrc="https://images.unsplash-com/photo-1627895431533-21b91e0a29c1?q=80&w=600&h=400" 
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
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">City Tour Packages</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        {/* <PackageCard 
          title="Half-Day City Tour" 
          details="4 Hours / 40 KMs. Covers 2-3 major spots."
        /> */}
        <PackageCard 
          title="Full-Day City Tour" 
          // price="₹2,500" 
          details="8 Hours / 80 KMs. Explore all of Bangalore's highlights."
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
export const Contact = () => (
  <section id="contact" className="container mx-auto px-6 py-20 text-center">
    <h2 className="text-4xl font-extrabold text-gray-900 mb-8">Get in Touch</h2>
    <p className="text-xl text-gray-600 mb-4">Have questions? We're here to help.</p>
    <p className="text-2xl font-semibold text-red-600">Email: support@roadroam.com</p>
    <p className="text-2xl font-semibold text-red-600">Phone: +91 98765 43210</p>
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