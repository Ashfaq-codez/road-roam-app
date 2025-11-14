// user-frontend/src/DestinationsPage.tsx
import React, { useState } from "react";
import { Header, Footer } from "./LandingPageComponents"; // updated header/footer already include hash navigation
import ScrollToTopButton from "./ScrollToTopButton";
import FloatingContact from "./FloatingContact";
import { Link } from "react-router-dom";
import "./index.css";

// Sample Data: Places within 80km of Bangalore
const places = [
  {
    name: "Nandi Hills",
    description: "A perfect spot for sunrise views and trekking, this ancient hill fortress is a popular quick getaway.",
    imgSrc: "/images/nandiHills.webp",
    layout: "md:col-span-1",
  },
  {
    name: "Bannerghatta National Park",
    description: "A large biological park with a zoo, a butterfly park, and a popular safari, all on the outskirts of the city.",
    imgSrc: "/images/nationalPark.webp",
    layout: "md:col-span-2",
  },
  {
    name: "Savandurga",
    description: "One of the largest monolith hills in Asia. It offers challenging climbs and stunning views of the surrounding landscape.",
    imgSrc: "/images/savandurga.webp",
    layout: "md:col-span-2",
  },
  {
    name: "Skandagiri",
    description: 'Famous for its "walk above the clouds," this night trek is a favorite for adventure seekers wanting to see a sea of clouds at dawn.',
    imgSrc: "/images/Skandagiri.webp",
    layout: "md:col-span-1",
  },
  {
    name: "Mall of Asia",
    description: "Phoenix Mall Of Asia in North Bengaluru is Indias first luxury retail mall to usher in a new age of shopping and leisure.",
    imgSrc: "/images/mallofasia.webp",
    layout: "md:col-span-1",
  },
  {
    name: "Ramanagara(Mekedatu-Sangama)",
    description: "Mekedatu is a scenic spot on the Kaveri River, with a narrow gorge. Its remote, and most visitors travel by bus. The name means `Goat's Leap`.",
    imgSrc: "/images/Mekedatu-Sangama.webp",
    layout: "md:col-span-2",
  },
];

export default function DestinationsPage() {
  return (
    <div className="font-poppins overflow-x-hidden">
      <ScrollToTopButton isVisible={false} />
      <FloatingContact />
      <Header />

      <main>
        {/* Page Title */}
        <section className="bg-gray-900 ext-white py-16 relative">
          <div className="container mx-auto px-6 text-center">
            <Link to="/" className="absolute left-6 top-8 text-white hover:text-red-500 font-semibold flex items-center space-x-2 transition-colors">
                ◄ Back to Home
            </Link>
            <h1 className="text-5xl text-yellow-400 font-extrabold mb-4">Destinations Near Bangalore</h1>
            <p className="text-xl text-gray-300">Fun places to travel around for your Tours & Trips.</p>
          </div>
        </section>

        {/* Grid of Places */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {places.map((place) => (
              <PlaceCard
                key={place.name}
                name={place.name}
                description={place.description}
                imgSrc={place.imgSrc}
                className={place.layout}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// PlaceCard accepts layout className (e.g., md:col-span-2)
const PlaceCard: React.FC<{ name: string; description: string; imgSrc: string; className?: string }> = ({
  name,
  description,
  imgSrc,
  className = "",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`bg-transparent rounded-xl h-64 w-full [perspective:1000px] cursor-pointer ${className}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
        {/* Front Side (Image) */}
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <img src={imgSrc} alt={name} className="w-full h-full object-cover rounded-xl shadow-lg" />
          <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
          <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-md">{name}</h3>
        </div>

        {/* Back Side (Text) */}
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-xl shadow-lg p-6 overflow-auto">
          <h4 className="text-xl font-bold text-red-600 mb-2">{name}</h4>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};
