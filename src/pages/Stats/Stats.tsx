import { useEffect, useState } from "react";
import "./Stats.css";

import { motion } from "framer-motion";
import { fetchTrips, type ApiTrip } from "../../services/api";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

function getStats(trips: ApiTrip[]) {
  const totalPhotos = trips.reduce((s, t) => s + t.photos.length, 0);

  const years = trips
    .map((t) => t.dates.match(/\d{4}/)?.[0])
    .filter((y): y is string => Boolean(y));

  const perYear: Record<string, number> = {};
  years.forEach((y) => {
    perYear[y] = (perYear[y] || 0) + 1;
  });

  const regions: Record<string, number> = {};
  trips.forEach((t) => {
    const country = t.region.split("·").pop()?.trim() || t.region;
    regions[country] = (regions[country] || 0) + 1;
  });

  const tagCounts: Record<string, number> = {};
  trips.forEach((t) =>
    (t.tags ?? []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    }),
  );

  const yearList = Object.entries(perYear).sort(
    ([a], [b]) => Number(a) - Number(b),
  );
  const maxPerYear = Math.max(...yearList.map(([, n]) => n), 1);

  const regionList = Object.entries(regions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const tagList = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const currentYear = new Date().getFullYear();
  const firstYear = years.length ? Math.min(...years.map(Number)) : currentYear;
  const yearsShooting = Math.max(1, currentYear - firstYear);

  return {
    totalPhotos,
    yearList,
    maxPerYear,
    regionList,
    tagList,
    yearsShooting,
  };
}

export default function Stats() {
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips()
      .then(({ data }) => setTrips(data))
      .finally(() => setLoading(false));
  }, []);

  const stats = getStats(trips);

  return (
    <main className="stats-page">
      <div className="stats-page_inner">
        <motion.p className="stats-page_eyebrow" {...fadeUp(0.05)}>
          By the numbers
        </motion.p>
        <motion.h1 className="stats-page_heading" {...fadeUp(0.15)}>
          Your Journey Stats
        </motion.h1>
        <motion.div className="stats-page_divider" {...fadeUp(0.25)} />

        {loading ? (
          <div className="stats-loading">
            <span className="auth-loading-spinner" />
          </div>
        ) : trips.length === 0 ? (
          <motion.p className="stats-empty" {...fadeUp(0.3)}>
            No trips yet — upload your first memory to start seeing stats.
          </motion.p>
        ) : (
          <>
            <motion.div className="stats-cards" {...fadeUp(0.3)}>
              <div className="stats-card">
                <span className="stats-card_value">
                  {String(trips.length).padStart(2, "0")}
                </span>
                <span className="stats-card_label">Destinations</span>
              </div>
              <div className="stats-card">
                <span className="stats-card_value">{stats.totalPhotos}</span>
                <span className="stats-card_label">Photos archived</span>
              </div>
              <div className="stats-card">
                <span className="stats-card_value">{stats.yearsShooting}+</span>
                <span className="stats-card_label">Years shooting</span>
              </div>
              <div className="stats-card">
                <span className="stats-card_value">
                  {Object.keys(stats.regionList).length > 0
                    ? stats.regionList.length
                    : "—"}
                </span>
                <span className="stats-card_label">Countries visited</span>
              </div>
            </motion.div>

            {stats.yearList.length > 0 && (
              <motion.section className="stats-section" {...fadeUp(0.4)}>
                <h2 className="stats-section_title">Trips per year</h2>
                <div className="stats-bars">
                  {stats.yearList.map(([year, count]) => (
                    <div key={year} className="stats-bar-row">
                      <span className="stats-bar_year">{year}</span>
                      <div className="stats-bar_track">
                        <motion.div
                          className="stats-bar_fill"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: count / stats.maxPerYear }}
                          transition={{
                            duration: 0.8,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          style={{ originX: 0 }}
                        />
                      </div>
                      <span className="stats-bar_count">{count}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {stats.regionList.length > 0 && (
              <motion.section className="stats-section" {...fadeUp(0.5)}>
                <h2 className="stats-section_title">Top countries</h2>
                <div className="stats-region-list">
                  {stats.regionList.map(([region, count], i) => (
                    <div key={region} className="stats-region-item">
                      <span className="stats-region_rank">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="stats-region_name">{region}</span>
                      <span className="stats-region_count">
                        {count} trip{count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {stats.tagList.length > 0 && (
              <motion.section className="stats-section" {...fadeUp(0.6)}>
                <h2 className="stats-section_title">Most used tags</h2>
                <div className="stats-tags">
                  {stats.tagList.map(([tag, count]) => (
                    <span key={tag} className="stats-tag">
                      {tag} <span className="stats-tag_count">{count}</span>
                    </span>
                  ))}
                </div>
              </motion.section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
