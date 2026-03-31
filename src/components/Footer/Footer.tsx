import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ApiTrip } from "../../services/api";
import "./Footer.css";

interface Props {
  trips?: ApiTrip[];
  publicBase?: string;
}

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function getMarqueeText(trips: ApiTrip[]) {
  if (trips.length === 0) return "Your journeys will appear here  ·  ";
  return trips.map((t) => t.place).join("  ·  ") + "  ·  ";
}

function getTripMeta(trip: ApiTrip) {
  const datePart = trip.dates.split(/[–-]/)[0].trim();
  const regionParts = trip.region.split(" · ");
  const country =
    regionParts.length > 1 ? regionParts[regionParts.length - 1] : trip.region;
  return `${datePart} · ${country}`;
}

export default function Footer({ trips = [], publicBase }: Props) {
  const marqueeText = getMarqueeText(trips);

  return (
    <footer className="page-footer">
      <div className="page-footer_marquee" aria-hidden="true">
        <div className="page-footer_marquee-track">
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      <div className="page-footer_grid">
        <motion.div
          className="page-footer_brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          viewport={{ amount: 0.3, once: false }}
        >
          <p className="page-footer_initials">TH</p>
          <p className="page-footer_tagline">
            A visual archive of
            <br />
            distant places.
          </p>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="page-footer_instagram"
          >
            <InstagramIcon />
            <span>Instagram</span>
            <span className="page-footer_instagram-arrow">↗</span>
          </a>
        </motion.div>

        <div className="page-footer_index">
          <p className="page-footer_index-label">
            Journeys{trips.length > 0 ? ` - ${trips.length}` : ""}
          </p>

          {trips.length === 0 ? (
            <p className="page-footer_empty">
              No journeys yet - add your first memory.
            </p>
          ) : (
            trips.slice(0, 10).map((trip, i) => (
              <motion.div
                key={trip.id}
                className="page-footer_trip"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
                viewport={{ amount: 0.2, once: false }}
              >
                <Link
                  to={
                    publicBase
                      ? `${publicBase}/trip/${trip.id}`
                      : `/trip/${trip.id}`
                  }
                  className="page-footer_trip-link"
                >
                  <span className="page-footer_trip-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="page-footer_trip-place">{trip.place}</span>
                  <span className="page-footer_trip-meta">
                    {getTripMeta(trip)}
                  </span>
                  <span className="page-footer_trip-arrow">→</span>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <motion.div
          className="page-footer_side"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease }}
          viewport={{ amount: 0.3, once: false }}
        >
          <p className="page-footer_side-label">Navigation</p>
          {[
            { label: "Journeys", href: publicBase ?? "/" },
            {
              label: "About Me",
              href: publicBase ? `${publicBase}/about` : "/about",
            },
            {
              label: "Interests",
              href: publicBase ? `${publicBase}/interests` : "/interests",
            },
          ].map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="page-footer_nav-link"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="page-footer_bar">
        <span className="page-footer_copy">
          Trip House © {new Date().getFullYear()}
        </span>
        <span className="page-footer_copy">All photographs by the author</span>
      </div>
    </footer>
  );
}

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
