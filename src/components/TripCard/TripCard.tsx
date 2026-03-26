import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import "./TripCard.css";

import { motion } from "framer-motion";
import type { Trip } from "../../data/trips";

interface TripCardProps {
  trip: Trip;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.78, delay, ease },
  }),
};

const TripCard = forwardRef<HTMLElement, TripCardProps>(({ trip }, ref) => {
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      className="trip-card"
      style={{ ["--accent" as string]: trip.accent }}
    >
      <div
        className="trip-card_bg"
        style={{ backgroundImage: `url(${trip.cover})` }}
      />
      <div className="trip-card_overlay" />

      <div className="trip-card_index" aria-hidden="true">
        {trip.index}
      </div>

      <div className="trip-card_content">
        <motion.div
          className="trip-card_meta"
          custom={0.05}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
        >
          <motion.div
            className="trip-card_meta-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease }}
            viewport={{ amount: 0.5, once: false }}
            style={{ originX: 0 }}
          />
          <span className="trip-card_region">{trip.region}</span>
        </motion.div>

        <motion.h2
          className="trip-card_place"
          custom={0.18}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
        >
          {trip.place}
        </motion.h2>

        <motion.p
          className="trip-card_dates"
          custom={0.32}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
        >
          {trip.dates}
        </motion.p>

        <motion.p
          className="trip-card_summary"
          custom={0.44}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
        >
          {trip.summary}
        </motion.p>

        <motion.div
          className="trip-card_actions"
          custom={0.58}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.5, once: false }}
        >
          <button
            className="trip-card_cta"
            onClick={() => navigate(`/trip/${trip.id}`)}
          >
            Explore Gallery
            <span className="trip-card_cta-arrow">→</span>
          </button>

          {trip.instagram && (
            <a
              href={trip.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="trip-card_instagram"
              aria-label={`See ${trip.place} on Instagram`}
            >
              <InstagramIcon />
              Instagram
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
});

TripCard.displayName = "TripCard";

export default TripCard;

function InstagramIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
