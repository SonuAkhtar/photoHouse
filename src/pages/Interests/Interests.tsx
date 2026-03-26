import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Interests.css";

import { motion } from "framer-motion";
import { fetchProfile, type ApiInterest } from "../../services/api";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Interests() {
  const [interests, setInterests] = useState<ApiInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile()
      .then(({ data }) => setInterests(data.interests || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="interests">
      <div className="interests_inner">
        <motion.p
          className="interests_eyebrow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          What moves me
        </motion.p>

        <motion.h1
          className="interests_heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          Areas of interest
        </motion.h1>

        {loading ? (
          <div className="interests_loading">
            <span className="auth-loading-spinner" />
          </div>
        ) : interests.length === 0 ? (
          <motion.div
            className="interests_empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease }}
          >
            <p>No interests added yet.</p>
            <p>
              Go to your{" "}
              <Link to="/profile" className="interests_profile-link">
                profile page
              </Link>{" "}
              to add your areas of interest — they'll appear here in the same
              card format.
            </p>
          </motion.div>
        ) : (
          <div className="interests_grid">
            {interests.map((item, i) => (
              <motion.div
                key={item.id}
                className="interests_card"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease }}
              >
                <span className="interests_card-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="interests_card-title">{item.title}</h2>
                {item.body && (
                  <p className="interests_card-body">{item.body}</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
