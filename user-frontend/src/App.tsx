import React, { Suspense } from 'react';
import {
  Header, Hero, Services, Fleet, Destinations, Packages, Contact, Footer, AboutUs, FAQ
} from './LandingPageComponents';
import FloatingContact from './FloatingContact';
import ScrollToTopButton from './ScrollToTopButton';
import { Helmet } from 'react-helmet-async';

const LazyBookingForm = React.lazy(() => import('./BookingForm'));

function App() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What makes Road Roam the best chauffeur service in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every chauffeur is background-verified, trained in defensive driving, and briefed on etiquette. Cars are sanitized before every ride and trips are GPS-tracked end to end."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer corporate chauffeur services in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Road Roam provides corporate car rentals with GST-compliant billing, monthly retainers, dedicated account managers and SLA-backed punctuality."
        }
      },
      {
        "@type": "Question",
        "name": "Can I book an outstation cab or tour package from Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer chauffeur-driven outstation trips to destinations like Mysore, Coorg and Nandi Hills, along with custom multi-day tour itineraries."
        }
      },
      {
        "@type": "Question",
        "name": "Are Road Roam vehicles sanitized between rides?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every car is sanitized before pickup, stocked with hand sanitizer, and chauffeurs can wear masks on request. Contactless payment is available."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a chauffeur-driven car rental cost in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing depends on vehicle type, distance and duration. Road Roam offers flat, upfront per-kilometre pricing with no surge charges."
        }
      },
      {
        "@type": "Question",
        "name": "Which cars are available — do you have Innova Crysta or Hycross with a driver?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our fleet includes the Innova Hycross, Innova Crysta, Innova, Ertiga, Ciaz and Dzire — every car comes with a chauffeur and GPS tracking."
        }
      },
      {
        "@type": "Question",
        "name": "Is Road Roam safe for women and solo travellers?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every trip is GPS-tracked in real time, chauffeurs are identity-verified, and our support team monitors bookings around the clock."
        }
      }
    ]
  };

  return (
    <div className="font-poppins overflow-x-hidden">
      
      {/* SEO TAGS */}
      <Helmet>
        <title>Road Roam Car Rentals – Best Chauffeur Services in Bangalore | Airport Taxi, Innova Crysta & Outstation Cabs</title>
        <meta 
          name="description" 
          content="Road Roam Car Rentals — the best chauffeur services in Bangalore. Airport transfers, city cruise packages, outstation tours, corporate rentals & event rentals. Innova Crysta, Hycross, Ertiga, Dzire fleet with GPS-tracked, verified drivers. Book online." 
        />
        <meta 
          name="keywords" 
          content="best chauffeur services in Bangalore, corporate chauffeur services Bangalore, chauffeur driven car rental Bangalore, airport taxi Bangalore, Kempegowda airport cab booking, outstation cabs Bangalore, Bangalore to Mysore cab, Bangalore to Coorg taxi, Innova Crysta rental with driver Bangalore, Toyota Hycross rental Bangalore, Ertiga car rental Bangalore, Dzire cab booking Bangalore, luxury car rental with driver Bangalore, event transportation Bangalore, wedding car rental Bangalore, city tour cabs Bangalore, women safe cab service Bangalore, GPS tracked cab Bangalore" 
        />
        <link rel="canonical" href="https://roadroam.in/" />
        
        {/* FAQ Schema for Google Search Rich Results */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <ScrollToTopButton isVisible={false} />
      <FloatingContact /> 
      
      <Header />

      <main>
        <Hero />
        
        <section className="bg-gray-100 py-20">
          <Suspense 
            fallback={
              <div className="text-center py-20 text-gray-700 font-bold">
                Loading Booking Form...
              </div>
            }
          >
            <LazyBookingForm />
          </Suspense>
        </section>

        <AboutUs /> 
        <Services />
        <Packages />
        <Destinations />
        <Fleet />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;