// user-frontend/src/LandingPageComponents.tsx
// This file contains all the new sections you requested.

import React from 'react';

// --- 1. Header Component ---
export const Header = () => (
  <header className="bg-white shadow-md sticky top-0 z-50">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-3xl font-extrabold text-indigo-700">
        🚗 Road Roam
      </div>
      <div className="space-x-4">
        <a href="#services" className="text-gray-600 hover:text-indigo-700 font-medium">Services</a>
        <a href="#fleet" className="text-gray-600 hover:text-indigo-700 font-medium">Our Fleet</a>
        <a href="#destinations" className="text-gray-600 hover:text-indigo-700 font-medium">Destinations</a>
        <a href="#contact" className="text-gray-600 hover:text-indigo-700 font-medium">Contact</a>
        <a 
          href="#booking-form" 
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Book Now
        </a>
      </div>
    </nav>
  </header>
);

// --- 2. Hero Component ---
export const Hero = () => (
  <div 
    className="relative h-screen min-h-[700px] flex items-center justify-center bg-cover bg-center" 
    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517524008697-84bbe3c3afd9?q=80&w=2070')" }}
  >
    <div className="absolute inset-0 bg-black opacity-60"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        Your Journey, Your Car, Your Way
      </h1>
      <p className="text-xl md:text-2xl font-light mb-8 drop-shadow-md">
        Explore Bangalore and beyond with Road Roam's reliable rental fleet.
      </p>
      <a 
        href="#booking-form" 
        className="bg-indigo-600 text-white font-bold py-4 px-10 text-lg rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
      >
        Reserve Your Car Today
      </a>
    </div>
  </div>
);

// --- 3. Services Component ---
export const Services = () => (
  <section id="services" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Our Services</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Service Card */}
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

// Helper for Service Card
const ServiceCard: React.FC<{title: string, description: string}> = ({ title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300">
    <h3 className="text-2xl font-bold text-indigo-700 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// --- 4. Fleet Component ---
export const Fleet = () => (
  <section id="fleet" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Our Fleet</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FleetCard 
          name="Sedans (Etios, Dzire)" 
          description="Comfortable and economical for city rides and small families." 
          imgSrc="https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d36?q=80&w=100" 
        />
        <FleetCard 
          name="SUVs (Innova, Ertiga)" 
          description="Spacious, powerful, and perfect for outstation trips or large groups." 
          imgSrc="https://images.unsplash.com/photo-1588440787334-b38122c3b246?q=80&w=100" 
        />
        <FleetCard 
          name="Luxury (BMW, Mercedes)" 
          description="Arrive in style. Our luxury fleet is available for corporate and special events." 
          imgSrc="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=100" 
        />
      </div>
    </div>
  </section>
);

// Helper for Fleet Card
const FleetCard: React.FC<{name: string, description: string, imgSrc: string}> = ({ name, description, imgSrc }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
    <img src={imgSrc.replace('w=100', 'w=600&h=400')} alt={name} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// --- 5. Destinations (Bangalore) Component ---
export const Destinations = () => (
  <section id="destinations" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-4">Explore Bangalore</h2>
    <p className="text-xl text-center text-gray-600 mb-12">Must-visit places for your in-city tour.</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DestinationCard 
        name="Bangalore Palace" 
        imgSrc="https://images.unsplash.com/photo-1574041355655-27a3c3b52e39?q=80&w=100" 
      />
      <DestinationCard 
        name="Lalbagh Botanical Garden" 
        imgSrc="https://images.unsplash.com/photo-1600201923483-c2c6a0b4d4f2?q=80&w=100" 
      />
      <DestinationCard 
        name="Cubbon Park" 
        imgSrc="https://images.unsplash.com/photo-1627895431533-21b91e0a29c1?q=80&w=100" 
      />
    </div>
  </section>
);

// Helper for Destination Card
const DestinationCard: React.FC<{name: string, imgSrc: string}> = ({ name, imgSrc }) => (
  <div className="relative rounded-xl shadow-lg overflow-hidden h-64 group">
    <img src={imgSrc.replace('w=100', 'w=600&h=400')} alt={name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-300" />
    <div className="absolute inset-0 bg-black opacity-40 group-hover:opacity-60 transition duration-300"></div>
    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{name}</h3>
  </div>
);

// --- 6. Packages Component ---
export const Packages = () => (
  <section id="packages" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">City Tour Packages</h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <PackageCard 
          title="Half-Day City Tour" 
          price="₹1,500" 
          details="4 Hours / 40 KMs. Covers 2-3 major spots."
        />
        <PackageCard 
          title="Full-Day City Tour" 
          price="₹2,500" 
          details="8 Hours / 80 KMs. Explore all of Bangalore's highlights."
        />
      </div>
    </div>
  </section>
);

// Helper for Package Card
const PackageCard: React.FC<{title: string, price: string, details: string}> = ({ title, price, details }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-indigo-600 text-center w-full md:w-96">
    <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-4xl font-extrabold text-indigo-700 mb-4">{price}</p>
    <p className="text-gray-600 mb-6">{details}</p>
    <a 
      href="#booking-form" 
      className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition duration-300"
    >
      Book This Package
    </a>
  </div>
);

// --- 7. Contact Component ---
export const Contact = () => (
  <section id="contact" className="container mx-auto px-6 py-20 text-center">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Get in Touch</h2>
    <p className="text-xl text-gray-600 mb-4">Have questions? We're here to help.</p>
    <p className="text-2xl font-semibold text-indigo-700">Email: support@roadroam.com</p>
    <p className="text-2xl font-semibold text-indigo-700">Phone: +91 98765 43210</p>
  </section>
);

// --- 8. Footer Component ---
export const Footer = () => (
  <footer className="text-center py-8 text-gray-500 bg-gray-800">
    <p className="text-white">© 2025 Road Roam. All rights reserved.</p>
    <p className="text-gray-400 text-sm">A professional service for your travel needs.</p>
  </footer>
);