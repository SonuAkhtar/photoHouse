import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  fetchProfile,
  fetchTrips,
  type ApiProfile,
  type ApiTrip,
} from "../../services/api";
import "./About.css";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.75, delay, ease },
});

function computeStats(trips: ApiTrip[]) {
  const destinations = trips.length;
  const totalPhotos = trips.reduce((s, t) => s + t.photos.length, 0);
  const years = trips
    .map((t) => t.dates.match(/\d{4}/)?.[0])
    .filter(Boolean)
    .map(Number);
  const currentYear = new Date().getFullYear();
  const yearsShooting =
    years.length > 0 ? Math.max(1, currentYear - Math.min(...years)) : 0;
  return { destinations, totalPhotos, yearsShooting };
}

export default function About() {
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [trips, setTrips] = useState<ApiTrip[]>([]);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchTrips()])
      .then(([{ data: prof }, { data: trps }]) => {
        setProfile(prof);
        setTrips(trps);
      })
      .catch(console.error);
  }, []);

  const stats = computeStats(trips);

  const bioParagraphs = (profile?.bio || "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const hasBio = bioParagraphs.length > 0;
  const hasQuote = profile?.quote?.trim();
  const hasGear = (profile?.gear?.length ?? 0) > 0;

  const statItems = [
    {
      value:
        stats.destinations > 0
          ? String(stats.destinations).padStart(2, "0")
          : "-",
      label: "Destinations",
    },
    {
      value: stats.yearsShooting > 0 ? `${stats.yearsShooting}+` : "-",
      label: "Years shooting",
    },
    {
      value: stats.totalPhotos > 0 ? `${stats.totalPhotos}+` : "-",
      label: "Frames kept",
    },
  ];

  return (
    <main className="about">
      <div className="about_inner">
        <motion.p className="about_eyebrow" {...fadeUp(0.1)}>
          Behind the lens
        </motion.p>

        <motion.h1 className="about_heading" {...fadeUp(0.2)}>
          Chasing light
          <br />
          across the world
        </motion.h1>

        <motion.div className="about_divider" {...fadeUp(0.32)} />

        <div className="about_body">
          <motion.div className="about_col" {...fadeUp(0.4)}>
            {hasBio ? (
              bioParagraphs.map((para, i) => (
                <p key={i} className="about_bio">
                  {para}
                </p>
              ))
            ) : (
              <p className="about_bio about_bio-empty">
                Add a bio on your{" "}
                <Link to="/profile" className="about_profile-link">
                  profile page
                </Link>{" "}
                to have it appear here.
              </p>
            )}
          </motion.div>

          <motion.div className="about_stats" {...fadeUp(0.52)}>
            {statItems.map((stat) => (
              <div key={stat.label} className="about_stat">
                <span className="about_stat-value">{stat.value}</span>
                <span className="about_stat-label">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {hasQuote && (
          <motion.blockquote className="about_quote" {...fadeUp(0.64)}>
            "{profile!.quote}"
          </motion.blockquote>
        )}

        {hasGear && (
          <motion.div className="about_gear" {...fadeUp(0.76)}>
            <p className="about_gear-label">Current kit</p>
            <div className="about_gear-list">
              {profile!.gear.map((item) => (
                <span key={item} className="about_gear-item">
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {!hasQuote && !hasGear && (
          <motion.p className="about_setup-hint" {...fadeUp(0.64)}>
            Complete your{" "}
            <Link to="/profile" className="about_profile-link">
              profile
            </Link>{" "}
            to add a quote and your gear kit.
          </motion.p>
        )}
      </div>
    </main>
  );
}
