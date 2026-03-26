import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '../../components/Hero/Hero';
import Footer from '../../components/Footer/Footer';
import TripCard from '../../components/TripCard/TripCard';
import NavDots from '../../components/NavDots/NavDots';
import { fetchTrips, type ApiTrip } from '../../services/api';
import { apiTripToTrip } from '../../utils/tripAdapter';
import './Home.css';

const FEATURED_COUNT = 6;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Home() {
  const [trips, setTrips]         = useState<ApiTrip[]>([]);
  const [loading, setLoading]     = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs    = useRef<(HTMLElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate    = useNavigate();

  const loadTrips = useCallback(async () => {
    try {
      const { data } = await fetchTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const featured = trips.slice(0, FEATURED_COUNT);

  useEffect(() => {
    if (featured.length === 0) return;
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIndex(i); },
        { threshold: 0.55, root: containerRef.current }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [featured.length]);

  const scrollToCard = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Empty state — no trips yet
  if (!loading && trips.length === 0) {
    return (
      <div className="home">
        <Hero count={0} />
        <motion.div
          className="home-empty"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="home-empty_eyebrow">Your journal is empty</p>
          <h2 className="home-empty_heading">Add your first memory</h2>
          <p className="home-empty_body">
            Use the <strong>+ Add Memory</strong> button in the header to upload photos from your travels.
          </p>
          <button
            className="home-empty_cta"
            onClick={() => navigate('/trips')}
          >
            Explore all trips →
          </button>
        </motion.div>
        <Footer trips={trips} />
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
        <Hero count={trips.length} />

        {loading
          ? (
            <div className="home-loading">
              <span className="auth-loading-spinner" />
            </div>
          )
          : featured.map((apiTrip, i) => (
            <TripCard
              key={apiTrip.id}
              trip={apiTripToTrip(apiTrip, i)}
              ref={el => { cardRefs.current[i] = el; }}
            />
          ))
        }

        <Footer trips={trips} />
      </div>
    </>
  );
}
