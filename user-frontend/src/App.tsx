// user-frontend/src/App.tsx

// import React from 'react';
// BookingForm is used for the booking section logic
import { BookingForm } from './BookingForm'; 
import { 
  Header, 
  Hero, 
  Services, 
  Fleet, 
  Destinations, 
  Packages, 
  Contact, 
  Footer 
} from './LandingPageComponents';

function App() {
  return (
    // FINAL FIX: Add overflow-x-hidden to prevent the horizontal scroll bar on mobile
    <div className="font-poppins overflow-x-hidden"> 
      
      {/* 1. Sticky Header */}
      <Header />

      <main>
        {/* 2. Full-screen Hero Image */}
        <Hero />
        
        {/* 3. Our Services Section */}
        <Services />
        
        {/* 4. Car Fleet Section */}
        <Fleet />
        
        {/* 5. Bangalore Destinations Section */}
        <Destinations />
        
        {/* 6. Tour Packages Section */}
        <Packages />

        {/* 7. The Booking Form */}
        <section className="bg-gray-100 py-20">
          <BookingForm />
        </section>

        {/* 8. Contact Info */}
        <Contact />
      </main>

      {/* 9. Footer */}
      <Footer />

    </div>
  );
}

export default App;