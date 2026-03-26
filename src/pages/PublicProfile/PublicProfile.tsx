import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPublicProfile, type PublicProfileResponse } from '../../services/api';
import './PublicProfile.css';

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease },
});

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [data, setData]       = useState<PublicProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;
    fetchPublicProfile(username)
      .then(({ data: d }) => setData(d))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return <div className="pub-loading"><span className="auth-loading-spinner" /></div>;
  }

  if (notFound || !data) {
    return (
      <div className="pub-not-found">
        <p className="pub-not-found_code">404</p>
        <h1 className="pub-not-found_heading">Profile not found</h1>
        <Link to="/" className="pub-not-found_link">← Back to home</Link>
      </div>
    );
  }

  const { user, trips, profile } = data;
  const bioParagraphs = (profile.bio || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean);

  return (
    <main className="pub">
      <div className="pub_inner">
        <motion.div className="pub_head" {...fadeUp(0.05)}>
          <div className="pub_avatar">{(user.name.charAt(0) || '?').toUpperCase()}</div>
          <div>
            <h1 className="pub_name">{user.name}</h1>
            <p className="pub_username">@{user.username}</p>
          </div>
        </motion.div>

        {bioParagraphs.length > 0 && (
          <motion.div className="pub_bio" {...fadeUp(0.15)}>
            {bioParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </motion.div>
        )}

        {profile.quote && (
          <motion.blockquote className="pub_quote" {...fadeUp(0.22)}>
            "{profile.quote}"
          </motion.blockquote>
        )}

        {profile.gear && profile.gear.length > 0 && (
          <motion.div className="pub_gear" {...fadeUp(0.28)}>
            <p className="pub_gear-label">Kit</p>
            <div className="pub_gear-list">
              {profile.gear.map(item => <span key={item} className="pub_gear-tag">{item}</span>)}
            </div>
          </motion.div>
        )}

        <motion.div className="pub_divider" {...fadeUp(0.35)} />

        <motion.div className="pub_trips-head" {...fadeUp(0.4)}>
          <p className="pub_trips-label">{trips.length} {trips.length === 1 ? 'Journey' : 'Journeys'}</p>
        </motion.div>

        {trips.length === 0 ? (
          <motion.p className="pub_empty" {...fadeUp(0.45)}>No trips shared yet.</motion.p>
        ) : (
          <motion.div className="pub_grid" {...fadeUp(0.45)}>
            {trips.map(trip => (
              <div key={trip.id} className="pub_card" style={{ ['--card-accent' as string]: trip.accent }}>
                <div className="pub_card-img-wrap">
                  <img src={trip.cover} alt={trip.place} className="pub_card-img" loading="lazy" />
                  <div className="pub_card-overlay" />
                </div>
                <div className="pub_card-body">
                  <p className="pub_card-region">{trip.region}</p>
                  <h3 className="pub_card-place">{trip.place}</h3>
                  <p className="pub_card-dates">{trip.dates}</p>
                  {(trip.tags ?? []).length > 0 && (
                    <div className="pub_card-tags">
                      {trip.tags.map(t => <span key={t} className="pub_card-tag">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
