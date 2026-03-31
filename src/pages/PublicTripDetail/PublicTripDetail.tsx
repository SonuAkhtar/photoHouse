import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Carousel from "../../components/Carousel/Carousel";
import { fetchPublicTrip, type ApiTrip } from "../../services/api";
import "../TripDetail/TripDetail.css";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function PublicTripDetail() {
  const { username, tripId } = useParams<{
    username: string;
    tripId: string;
  }>();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<ApiTrip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username || !tripId) {
      navigate("/");
      return;
    }
    window.scrollTo(0, 0);
    fetchPublicTrip(username, tripId)
      .then(({ data }) => setTrip(data))
      .catch(() => navigate(`/u/${username}`))
      .finally(() => setLoading(false));
  }, [username, tripId, navigate]);

  if (loading) {
    return (
      <div className="detail-loading">
        <span className="auth-loading-spinner" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="detail" style={{ ["--accent" as string]: trip.accent }}>
      <header className="detail_header">
        <Link to={`/u/${username}`} className="detail_back">
          <span className="detail_back-arrow">←</span>
          <span className="detail_back-label">Back to profile</span>
        </Link>

        <motion.div
          className="detail_title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <h1 className="detail_place">{trip.place}</h1>
          <p className="detail_region">{trip.region}</p>
        </motion.div>

        <p className="detail_dates">{trip.dates}</p>
      </header>

      <div className="detail_body">
        <div className="detail_meta">
          <motion.p
            className="detail_summary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            {trip.summary}
          </motion.p>

          {(trip.tags ?? []).length > 0 && (
            <motion.div
              className="detail_tags"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              {trip.tags.map((tag) => (
                <span key={tag} className="detail_tag">
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div
          className="detail_carousel-wrap"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <Carousel photos={trip.photos} />
        </motion.div>
      </div>
    </div>
  );
}
