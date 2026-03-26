import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "./AllTrips.css";

import { motion } from "framer-motion";
import { fetchTrips, type ApiTrip } from "../../services/api";
import { TripCardSkeleton } from "../../components/Skeleton/Skeleton";

const PER_PAGE = 10;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function AllTrips() {
  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips()
      .then(({ data }) => setTrips(data))
      .finally(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    trips.forEach((t) => (t.tags ?? []).forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [trips]);

  const filtered = useMemo(() => {
    let result = trips;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.place.toLowerCase().includes(q) ||
          t.region.toLowerCase().includes(q) ||
          t.summary.toLowerCase().includes(q) ||
          (t.tags ?? []).some((tag) => tag.includes(q)),
      );
    }
    if (activeTag) {
      result = result.filter((t) => (t.tags ?? []).includes(activeTag));
    }
    return result;
  }, [trips, query, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = (page - 1) * PER_PAGE;
  const visible = filtered.slice(start, start + PER_PAGE);

  const goTo = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (val: string) => {
    setQuery(val);
    setPage(1);
  };
  const handleTag = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
    setPage(1);
  };

  return (
    <main className="all-trips">
      <div className="all-trips_inner">
        <motion.div
          className="all-trips_head"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="all-trips_head-left">
            <p className="all-trips_eyebrow">Archive</p>
            <h1 className="all-trips_heading">All Journeys</h1>
          </div>
          <span className="all-trips_count">
            {loading
              ? "—"
              : `${filtered.length} destination${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </motion.div>

        <motion.div
          className="all-trips_toolbar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          <div className="all-trips_search-wrap">
            <svg
              className="all-trips_search-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="all-trips_search"
              type="search"
              placeholder="Search destinations, regions, tags…"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search trips"
            />
            {query && (
              <button
                className="all-trips_search-clear"
                onClick={() => handleSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {allTags.length > 0 && (
            <div className="all-trips_tags">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`all-trips_tag${activeTag === tag ? " all-trips_tag-active" : ""}`}
                  onClick={() => handleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {(query || activeTag) && (
                <button
                  className="all-trips_clear-btn"
                  onClick={() => {
                    setQuery("");
                    setActiveTag(null);
                    setPage(1);
                  }}
                >
                  ✕ Clear filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        <div className="all-trips_divider" />

        {loading ? (
          <div className="all-trips_grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="all-trips_empty">
            {trips.length === 0 ? (
              <p>
                No trips yet. Use <strong>+ Add Memory</strong> to start your
                journal.
              </p>
            ) : (
              <p>
                No results for <strong>"{query || activeTag}"</strong>. Try a
                different search.
              </p>
            )}
          </div>
        ) : (
          <div className="all-trips_grid">
            {visible.map((trip, i) => (
              <motion.div
                key={trip.id}
                className="trip-grid-card"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.045, ease }}
              >
                <Link to={`/trip/${trip.id}`} className="trip-grid-card_link">
                  <div
                    className="trip-grid-card_img-wrap"
                    style={{ ["--card-accent" as string]: trip.accent }}
                  >
                    <img
                      src={trip.cover}
                      alt={trip.place}
                      className="trip-grid-card_img"
                      loading="lazy"
                    />
                    <div className="trip-grid-card_overlay" />
                    <span className="trip-grid-card_index">
                      {String(start + i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="trip-grid-card_body">
                    <div className="trip-grid-card_meta">
                      <span
                        className="trip-grid-card_accent-dot"
                        style={{ background: trip.accent }}
                      />
                      <span className="trip-grid-card_region">
                        {trip.region}
                      </span>
                    </div>
                    <h2 className="trip-grid-card_place">{trip.place}</h2>
                    <p className="trip-grid-card_dates">{trip.dates}</p>
                    <p className="trip-grid-card_summary">{trip.summary}</p>
                    {(trip.tags ?? []).length > 0 && (
                      <div className="trip-grid-card_tags">
                        {trip.tags.map((t) => (
                          <span key={t} className="trip-grid-card_tag">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="trip-grid-card_cta">
                      View Gallery
                      <span className="trip-grid-card_arrow">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="all-trips_pagination">
            <button
              className="all-trips_page-btn all-trips_page-btn-nav"
              onClick={() => goTo(page - 1)}
              disabled={page === 1}
              aria-label="Previous page"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`all-trips_page-btn${p === page ? " all-trips_page-btn-active" : ""}`}
                onClick={() => goTo(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </button>
            ))}
            <button
              className="all-trips_page-btn all-trips_page-btn-nav"
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
