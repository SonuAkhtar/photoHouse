import type { Trip } from '../../data/trips';
import './NavDots.css';

interface NavDotsProps {
  trips: Trip[];
  activeIndex: number;
  onDotClick: (i: number) => void;
}

export default function NavDots({ trips, activeIndex, onDotClick }: NavDotsProps) {
  return (
    <div className="nav-dots">
      {trips.map((trip, i) => (
        <button
          key={trip.id}
          className={`nav-dots_dot${activeIndex === i ? ' nav-dots_dot-active' : ''}`}
          style={{ ['--dot-accent' as string]: trip.accent }}
          onClick={() => onDotClick(i)}
          aria-label={`Go to ${trip.place}`}
        />
      ))}
    </div>
  );
}
