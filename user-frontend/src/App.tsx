// user-frontend/src/App.tsx (Final Code with Code Splitting)

import React, { Suspense } from 'react'; // 1. Import Suspense
import {
  Header, Hero, Services, Fleet, Destinations, Packages, Contact, Footer, AboutUs
} from './LandingPageComponents'; // Ensure all static components are imported
import FloatingContact from './FloatingContact';
import ScrollToTopButton from './ScrollToTopButton';

// --- CRITICAL FIX: LAZY LOAD COMPONENT DEFINITION ---
// 2. Use React.lazy for the BookingForm component
const LazyBookingForm = React.lazy(() => import('./BookingForm'));
// --- -------------------------------------------- ---


function App() {
  return (
    <div className="font-poppins overflow-x-hidden">
      
      {/* --- Floating Components --- */}
      <ScrollToTopButton isVisible={false} />
      <FloatingContact /> 
      
      {/* 1. Header */}
      <Header />

      <main>
        {/* 2. Page Content (These sections load immediately) */}
        <Hero />
        {/* 3. CRITICAL FIX: Lazy-Loaded Booking Form Section */}
        {/* This Suspense boundary ensures the form loads only when visible (or shortly after) */}
        <section className="bg-gray-100 py-20">
          <Suspense 
            fallback={
              <div className="text-center py-20 text-gray-700 font-bold">
                Loading Booking Form...
              </div>
            }
          >
            {/* The actual component call */}
            <LazyBookingForm />
          </Suspense>
        </section>
        <AboutUs /> 
        <Services />
        <Packages />
        <Destinations />
        <Fleet />
        <Contact />

      </main>

      {/* 4. Footer */}
      <Footer />

    </div>
  );
}

export default App;