import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useHashNavigation = () => {
  const navigate = useNavigate();

  const goTo = (pathWithHash: string) => {
    const [pathPart, hashPart] = pathWithHash.split("#");
    const path = pathPart || "/";

    navigate(path);

    setTimeout(() => {
      if (hashPart) {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.location.hash = hashPart;
        }
      }
    }, 80);
  };

  return goTo;
};

export const HashLink: React.FC<
  React.PropsWithChildren<{ to: string; className?: string; onClick?: () => void }>
> = ({ to, children, className = "", onClick }) => {
  const goTo = useHashNavigation();
  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    goTo(to);
    onClick?.();
  };
  return (
    <button onClick={handle} className={className} aria-label={`Go to ${to}`}>
      {children}
    </button>
  );
};

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const goTo = useHashNavigation();

  const goAndClose = (pathWithHash: string) => {
    goTo(pathWithHash);
    setIsOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => goAndClose("/")}
          id="main-logo"
          className="flex flex-col h-10 -space-y-1 z-50 bg-transparent border-0 cursor-pointer"
        >
          <div className="text-3xl font-extrabold flex">
            <span className={isOpen ? "text-white" : "text-gray-900"}>Road</span>
            <span className="text-red-600 relative">Roam</span>
          </div>
          <span className="text-gray-600 text-xs font-semibold tracking-tight self-end mr-0.5">
            Car Rentals
          </span>
        </button>

        <button
          className="md:hidden text-2xl p-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={isOpen ? "text-white" : "text-gray-800"}>
            {isOpen ? "✕" : "☰"}
          </span>
        </button>

        <div className="hidden md:flex space-x-4 items-center">
          <NavBtn onClick={() => goTo("/#services")}>Services</NavBtn>
          <NavBtn onClick={() => goTo("/#fleet")}>Our-Fleet</NavBtn>
          <NavBtn onClick={() => goTo("/#destinations")}>Around-City</NavBtn>
          <NavBtn onClick={() => goTo("/#faq")}>FAQs</NavBtn>
          <NavBtn onClick={() => goTo("/#contact")}>Contact</NavBtn>

          <button
            onClick={() => goTo("/#booking-form")}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 w-full h-full bg-black transition-transform duration-300 transform md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 p-6`}
        style={{ overflowY: "auto" }}
      >
        <div className="flex flex-col space-y-6 pt-20">
          <MobileNavBtn onClick={() => goAndClose("/#services")}>Services</MobileNavBtn>
          <MobileNavBtn onClick={() => goAndClose("/#fleet")}>Our Fleet</MobileNavBtn>
          <MobileNavBtn onClick={() => goAndClose("/#destinations")}>Around the City</MobileNavBtn>
          <MobileNavBtn onClick={() => goAndClose("/#faq")}>FAQs</MobileNavBtn>
          <MobileNavBtn onClick={() => goAndClose("/#contact")}>Contact</MobileNavBtn>

          <button
            onClick={() => goAndClose("/#booking-form")}
            className="mt-4 bg-red-600 text-white font-bold py-3 px-6 text-center rounded-lg hover:bg-red-700 transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
};

const NavBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-red-600 font-medium transition-colors bg-transparent cursor-pointer"
  >
    {children}
  </button>
);

const MobileNavBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className="text-white text-3xl font-extrabold hover:text-red-500 transition-colors block border-b border-gray-700 pb-3 text-left bg-transparent"
  >
    {children}
  </button>
);

// HERO COMPONENT WITH SEO EYEBROW ANCHOR
export const Hero: React.FC = () => (
  <div className="relative min-h-[70vh] py-20 flex items-center justify-center overflow-hidden">
    <img
      src="/images/roadroam.avif"
      alt="Road Roam Car Rental Hero"
      fetchPriority="high"
      className="absolute inset-0 w-full h-full object-cover scale-105 z-0"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-black/30 to-black/80"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      
      {/* SEO Eyebrow Keyword */}
      <span className="text-red-500 font-bold uppercase tracking-widest text-xs md:text-sm mb-3 block drop-shadow-md">
        Best Chauffeur Services in Bangalore
      </span>

      <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
        Your Journey, Our <span className="text-red-500">Wheels</span>, Explore With Ease.
      </h1>
      <p className="text-xl md:text-2xl font-light mb-8 drop-shadow-md max-w-3xl">
        Travel stress-free with Road Roam’s chauffeur-driven rentals
      </p>
      <HashLink
        to="/#booking-form"
        className="bg-red-600 text-white font-bold py-4 px-10 text-lg rounded-lg hover:bg-red-700 transition duration-300 transform hover:scale-105 inline-block text-center"
      >
        Reserve Your Car Today
      </HashLink>
    </div>
  </div>
);

interface FeatureCardProps {
  imgSrc: string;
  title: string;
  description: string;
  reverse?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imgSrc, title, description, reverse = false }) => {
  const imageOrder = reverse ? "md:order-last" : "md:order-first";
  const textOrder = reverse ? "md:order-first" : "md:order-last";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div className={`w-full h-80 rounded-xl overflow-hidden shadow-2xl ${imageOrder}`}>
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500 ease-in-out"
        />
      </div>

      <div className={`w-full ${textOrder}`}>
        <h3 className="text-3xl font-bold text-red-600 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export const AboutUs: React.FC = () => (
  <section id="about" className="bg-white px-6 py-20 shadow-inner">
    <div className="container mx-auto max-w-6xl">
      <h2 className="text-[47px] font-extrabold text-center text-gray-900 mb-16 border-b pb-4">
        Why Choose <span className="text-red-600">Road Roam</span>?
      </h2>

      <div className="space-y-20">
        <FeatureCard
          imgSrc="/images/certified.webp"
          title="Certified Safety & Tracking"
          description="All vehicles are equipped with real-time GPS tracking. We prioritize the safety of women and solo travelers with 24/7 monitoring."
        />

        <FeatureCard
          imgSrc="/images/chauffeur.webp"
          title="Expert Chauffeur Driven"
          description="Travel stress-free with our vetted, professional drivers. Focus on your journey while we handle the traffic and navigation."
          reverse={true}
        />

        <FeatureCard
          imgSrc="/images/rupee.webp"
          title="Best Value Guaranteed"
          description="Premium, well-maintained cars at the most competitive rates in the market. Get the best possible service without overpaying."
        />

        <FeatureCard
          imgSrc="/images/support.webp"
          title="24/7 Customer Support"
          description="Our Team is available for any sort of doubt and support related to your car rental, we are available on WhatsApp, Sms and Call +91 8105880756 "
          reverse={true}
        />
      </div>

      <p className="mt-20 font-bold text-center text-[25px] text-gray-700 border-t pt-8">
        Easy to Avail, transparent pricing, and quality vehicles for a truly reliable rental experience.
      </p>
    </div>
  </section>
);

export const Services: React.FC = () => (
  <section id="services" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-gray-200 mb-12">
      Our <span className="text-red-600">Chauffeur</span> Services
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <ServiceCard title="Airport Transfers" description="Reliable, on-time pickups and drops to Kempegowda International Airport." className="md:col-span-1" />
      <ServiceCard title="City Cruise" description="Explore Bangalore at your own pace. Perfect for sightseeing, shopping, or business meetings." className="md:col-span-2" />
      <ServiceCard title="Tours & Trips" description="Plan your weekend getaway. We cover all major destinations from Bangalore." className="md:col-span-2" />
      <ServiceCard title="Corporate Rentals" description="Premium vehicles and professional chauffeurs for your business needs." className="md:col-span-1" />
      <ServiceCard title="Event Rentals" description="Premium vehicles and professional chauffeurs for your Event needs." className="md:col-span-3" />
    </div>
  </section>
);

const ServiceCard: React.FC<{ title: string; description: string; className?: string }> = ({ title, description, className = "" }) => (
  <div
    className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] hover:border-red-500 cursor-pointer h-full ${className}`}
  >
    <h3 className="text-2xl font-bold text-red-600 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export const Fleet: React.FC = () => (
  <section id="fleet" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-red-600 mb-12">
        <span className="text-gray-900">Our</span> Fleet
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FleetCard name="Hycross" description="Arrive in style. Our luxury fleet is available for the journey." imgSrc="/images/hycross.webp" />
        <FleetCard name="Crysta" description="Arrive in style. Our luxury fleet is available for the journey." imgSrc="/images/crysta.webp" />
        <FleetCard name="Innova" description="Spacious, powerful, and perfect for outstation trips or large groups." imgSrc="/images/innova.webp" />
        <FleetCard name="Ertiga" description="Spacious, powerful, and perfect for outstation trips or large groups." imgSrc="/images/ertiga.webp" />
        <FleetCard name="Ciaz" description="Comfortable and economical for city rides and small families." imgSrc="/images/ciaz.webp" />
        <FleetCard name="Dzire" description="Comfortable and economical for city rides and small families." imgSrc="/images/dzire.webp" />
      </div>
    </div>
  </section>
);

const FleetCard: React.FC<{ name: string; description: string; imgSrc: string }> = ({ name, description, imgSrc }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
    <div className="relative pt-[50%] overflow-hidden">
      <img src={imgSrc} alt={name} className="absolute inset-0 w-full h-full object-cover" />
    </div>

    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{name}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export const Destinations: React.FC = () => (
  <section id="destinations" className="container mx-auto px-6 py-20">
    <h2 className="text-4xl font-extrabold text-center text-yellow-400 mb-4">Explore Bangalore</h2>
    <p className="text-xl text-center text-gray-600 mb-12">Must visit places for your in city cruise.</p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DestinationCard
        name="Bangalore Palace"
        imgSrc="/images/palace.webp"
        description="A stunning example of Tudor architecture in the heart of the city, featuring elegant woodcarvings and beautiful gardens."
      />
      <ViewMoreCard imgSrc="/images/a.webp" />
      <DestinationCard
        name="Lalbagh Botanical Garden"
        imgSrc="/images/Lalbagh-Bangalore.webp"
        description="A historic garden with a rare collection of tropical plants, a famous glass house, and a serene lake."
      />
    </div>
  </section>
);

const DestinationCard: React.FC<{ name: string; imgSrc: string; description: string }> = ({ name, imgSrc, description }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="bg-transparent rounded-xl h-64 w-full [perspective:1000px] cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img src={imgSrc} alt={name} className="w-full h-full object-cover rounded-xl shadow-lg" />
          <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
          <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{name}</h3>
        </div>

        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-lg p-6 overflow-auto">
          <h4 className="text-xl font-bold text-red-600 mb-2">{name}</h4>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const ViewMoreCard: React.FC<{ imgSrc: string }> = ({ imgSrc }) => (
  <a href="/destinations"
    className="relative flex flex-col items-center justify-center rounded-xl shadow-lg h-64 w-full transform transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.02] group overflow-hidden"
  >
    <img src={imgSrc} alt="Explore More Destinations" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out z-0" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
    <div className="relative z-20 text-white flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">→</div>
      <h3 className="text-2xl font-bold text-center">View More Places</h3>
      <p className="text-gray-200 text-center">Discover all fun spots</p>
    </div>
  </a>
);

export const Packages: React.FC = () => (
  <section id="packages" className="bg-gray-100 px-6 py-20">
    <div className="container mx-auto">
      <h2 className="text-4xl font-extrabold text-center text-red-600 mb-12">Standard <span className="text-gray-900">Package</span></h2>
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <PackageCard title="City Cruise" details="8 Hours / 80 KMs. Explore all of Bangalore's highlights with our Standard package." />
      </div>
    </div>
  </section>
);

const PackageCard: React.FC<{ title: string; details: string }> = ({ title, details }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-600 text-center w-full md:w-96 transform hover:scale-105 transition duration-300">
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-6">{details}</p>
    <HashLink
      to="/#booking-form"
      className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition duration-300 inline-block text-center"
    >
      Book This Package
    </HashLink>
  </div>
);

// NEW FAQ COMPONENT (HTML5 NATIVE ACCORDION - 100% SEO SAFE)
export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "What makes Road Roam the best chauffeur service in Bangalore?",
      a: "Every chauffeur is background-verified, trained in defensive driving, and briefed on etiquette and confidentiality. Cars are sanitized before every ride and trips are GPS-tracked end to end."
    },
    {
      q: "Do you offer corporate chauffeur services in Bangalore?",
      a: "Yes. Road Roam provides corporate car rentals with GST-compliant billing, monthly retainers, dedicated account managers and SLA-backed punctuality for IT companies, startups and enterprises."
    },
    {
      q: "Can I book an outstation cab or tour package from Bangalore?",
      a: "Yes. We offer chauffeur-driven outstation trips to destinations like Mysore, Coorg and Nandi Hills, along with custom multi-day tour itineraries."
    },
    {
      q: "Are Road Roam vehicles sanitized between rides?",
      a: "Every car is sanitized before pickup, stocked with hand sanitizer, and chauffeurs can wear masks on request. Contactless payment is available on every booking."
    },
    {
      q: "How much does a chauffeur-driven car rental cost in Bangalore?",
      a: "Pricing depends on vehicle type, distance and duration. Road Roam offers flat, upfront per-kilometre pricing with no surge charges, shown before you confirm a booking."
    },
    {
      q: "Which cars are available — do you have Innova Crysta or Hycross with a driver?",
      a: "Yes. Our fleet includes the Innova Hycross, Innova Crysta, Innova, Ertiga, Ciaz and Dzire — every car comes with a chauffeur, GPS tracking and is available for city, airport or outstation bookings."
    },
    {
      q: "Is Road Roam safe for women and solo travellers?",
      a: "Yes. Every trip is GPS-tracked in real time, chauffeurs are identity-verified, and our support team monitors bookings around the clock — you can also share your live trip with anyone."
    }
  ];

  return (
    <section id="faq" className="bg-gray-100 px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Frequently Asked <span className="text-red-600">Questions</span>
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            /* Using native <details> tag keeps content in the DOM for SEO bots */
            <details 
              key={idx} 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* list-none and webkit-details-marker:hidden removes the default browser arrow */}
              <summary className="w-full p-6 text-left font-bold text-gray-800 flex justify-between items-center hover:text-red-600 transition cursor-pointer list-none [&::-webkit-details-marker]:hidden outline-none">
                <span className="text-lg pr-4">{faq.q}</span>
                {/* The '+' icon rotates to an 'x' when opened */}
                <span className="text-2xl font-normal transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

// export const Contact: React.FC = () => (
//   <section id="contact" className="container mx-auto px-6 py-20 text-center">
//     <h2 className="text-4xl font-extrabold text-gray-300 mb-8">Get <span className="text-red-600">in</span> Touch</h2>
//     <p className="text-xl text-gray-500 mb-4">Have questions? We're here to help.</p>

//     <div className="mb-10">
//       <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
//         <span className="text-white">Email: </span> roadroamcarrentals@gmail.com
//       </p>

//       <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
//         <span className="text-white">Phone: </span> +91 81058 80756
//       </p>
//     </div>
//     <HashLink
//       to="/#booking-form"
//       className="inline-block bg-red-600 text-white font-bold py-3 px-10 text-lg rounded-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:scale-105"
//     >
//       Book Now
//     </HashLink>
//   </section>
// );

// ----------------------
// Contact
// ----------------------
export const Contact: React.FC = () => (
  <section id="contact" className="container mx-auto px-6 py-20 text-center">
    <h2 className="text-4xl font-extrabold text-gray-300 mb-8">Get <span className="text-red-600">in</span> Touch</h2>
    <p className="text-xl text-gray-500 mb-4">Have questions? We're here to help.</p>

    <div className="mb-10">
      <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
        <span className="text-white">Email: </span> roadroamcarrentals@gmail.com
      </p>

      <p className="text-[20px] font-semibold text-red-600 break-words text-wrap">
        <span className="text-white">Phone: </span> +91 81058 80756
      </p>
    </div>
    
    {/* Flex container to stack the buttons vertically with uniform widths */}
    <div className="flex flex-col items-center justify-center space-y-4">
      <HashLink
        to="/#booking-form"
        className="inline-block bg-red-600 text-white font-bold py-3 px-10 text-lg rounded-lg shadow-xl hover:bg-red-700 transition duration-300 transform hover:scale-105 w-64"
      >
        Book Now
      </HashLink>
      
      <a
        href="https://wa.me/918105880756"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center bg-[#25D366] text-white font-bold py-3 px-10 text-lg rounded-lg shadow-xl hover:bg-[#0e5529] transition duration-300 transform hover:scale-105 w-64"
      >
        Book On 
        {/* Inline SVG for the WhatsApp Icon */}
        <svg 
          className="w-6 h-6 ml-2 fill-current" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        
      </a>
    </div>
  </section>
);

export const Footer: React.FC = () => {
  const goTo = useHashNavigation();

  return (
    <footer className="text-center py-8 bg-black">
      <button
        onClick={() => goTo("/")}
        className="w-full flex items-baseline justify-center mb-2 bg-transparent border-0 cursor-pointer"
      >
        <span className="text-2xl font-extrabold text-white">Road</span>
        <div className="flex flex-col -ml-0.5">
          <span className="text-2xl font-extrabold text-red-600">Roam</span>
          <span className="text-[9px] font-semibold tracking-tight -mt-1 self-end text-gray-400">
            Car Rentals
          </span>
        </div>
      </button>

      <p className="text-gray-400 text-sm">Chauffeur-driven car rentals in Bangalore — airport transfers, city cruises, tours, corporate and event rentals.</p>
      <p className="text-gray-500 text-xs mt-4">© 2026, Road Roam - Car Rentals. All rights reserved.</p>
    </footer>
  );
};