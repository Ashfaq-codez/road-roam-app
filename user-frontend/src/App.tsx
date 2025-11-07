// user-frontend/src/App.tsx
// This is your new homepage, assembling all the components.

import React from 'react';
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
    <div className="font-poppins"> {/* Font is applied from index.css */}
      
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