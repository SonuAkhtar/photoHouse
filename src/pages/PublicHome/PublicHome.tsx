import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Hero from "../../components/Hero/Hero";
import Footer from "../../components/Footer/Footer";
import TripCard from "../../components/TripCard/TripCard";
import NavDots from "../../components/NavDots/NavDots";
import { apiTripToTrip } from "../../utils/tripAdapter";
import { usePub } from "../../context/PublicProfileContext";
import "../Home/Home.css";

const FEATURED_COUNT = 6;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function PublicHome() {
  const { trips: apiTrips, username } = usePub();
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const featured = apiTrips.slice(0, FEATURED_COUNT);
  const linkBase = `/u/${username}/trip`;
  const pubBase = `/u/${username}`;

  useEffect(() => {
    if (featured.length === 0) return;
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(i);
        },
        { threshold: 0.55, root: containerRef.current },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [featured.length]);

  const scrollToCard = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth" });
  };

  if (apiTrips.length === 0) {
    return (
      <div className="home">
        <Hero count={0} />
        <motion.div
          className="home-empty"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="home-empty_eyebrow">No journeys yet</p>
          <h2 className="home-empty_heading">Nothing to show here</h2>
          <p className="home-empty_body">
            This traveller hasn't added any trips yet.
          </p>
        </motion.div>
        <Footer trips={[]} publicBase={pubBase} />
      </div>
    );
  }

  return (
    <>
      {featured.length > 0 && (
        <NavDots
          trips={featured.map(apiTripToTrip)}
          activeIndex={activeIndex}
          onDotClick={scrollToCard}
        />
      )}

      <div className="home" ref={containerRef}>
        <Hero count={apiTrips.length} />

        {featured.map((apiTrip, i) => (
          <TripCard
            key={apiTrip.id}
            trip={apiTripToTrip(apiTrip, i)}
            linkBase={linkBase}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          />
        ))}

        <Footer trips={apiTrips} publicBase={pubBase} />
      </div>
    </>
  );
}
