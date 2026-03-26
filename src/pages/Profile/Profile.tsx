import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  fetchProfile,
  saveProfile,
  fetchTrips,
  type ApiProfile,
  type ApiInterest,
  type ApiTrip,
} from "../../services/api";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease },
});

// ----- Stat helpers -----------------------------------------------------------------------------------------------------------------------------------------------------------

function computeStats(trips: ApiTrip[]) {
  const destinations = trips.length;
  const totalPhotos = trips.reduce((s, t) => s + t.photos.length, 0);

  // Extract 4-digit years from all date strings, find the earliest
  const years = trips
    .map((t) => t.dates.match(/\d{4}/)?.[0])
    .filter(Boolean)
    .map(Number);
  const currentYear = new Date().getFullYear();
  const yearsShooting =
    years.length > 0 ? Math.max(1, currentYear - Math.min(...years)) : 0;

  return { destinations, totalPhotos, yearsShooting };
}

// ----- Component ----------------------------------------------------------------------------------------------------------------------------------------------------------------─

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<ApiTrip[]>([]);
  const [bio, setBio] = useState("");
  const [quote, setQuote] = useState("");
  const [gear, setGear] = useState<string[]>([]);
  const [gearInput, setGearInput] = useState("");
  const [interests, setInterests] = useState<ApiInterest[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Fetch profile + trips in parallel
  useEffect(() => {
    Promise.all([fetchProfile(), fetchTrips()])
      .then(([{ data: prof }, { data: trps }]) => {
        setBio(prof.bio || "");
        setQuote(prof.quote || "");
        setGear(prof.gear || []);
        setInterests(prof.interests || []);
        setTrips(trps);
      })
      .catch(() => setError("Failed to load profile."))
      .finally(() => setLoading(false));
  }, []);

  const stats = computeStats(trips);

  // ----- Gear ---------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const addGear = () => {
    const val = gearInput.trim();
    if (!val || gear.includes(val)) return;
    setGear((prev) => [...prev, val]);
    setGearInput("");
  };

  const handleGearKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addGear();
    }
  };

  const removeGear = (item: string) =>
    setGear((prev) => prev.filter((g) => g !== item));

  // ----- Interests ------------------------------------------------------------------------------------------------------------------------------------------------------─

  const addInterest = () =>
    setInterests((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: "", body: "" },
    ]);

  const updateInterest = (id: string, field: "title" | "body", value: string) =>
    setInterests((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    );

  const removeInterest = (id: string) =>
    setInterests((prev) => prev.filter((it) => it.id !== id));

  // ----- Save ----------------------------------------------------------------------------------------------------------------------------------------------------------------─

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await saveProfile({ bio, quote, gear, interests });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <span className="auth-loading-spinner" />
      </div>
    );
  }

  return (
    <main className="profile">
      <div className="profile_inner">
        {/* ----- Page header ----- */}
        <motion.div className="profile_head" {...fadeUp(0.05)}>
          <div>
            <p className="profile_eyebrow">Account</p>
            <h1 className="profile_heading">{user?.name}</h1>
            <p className="profile_email">{user?.email}</p>
          </div>
          <div className="profile_head-actions">
            <button className="profile_logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </motion.div>

        <motion.div className="profile_divider" {...fadeUp(0.15)} />

        {/* ----- Live stats (read-only, computed from trips) ----- */}
        <motion.div className="profile_stats-row" {...fadeUp(0.2)}>
          <p className="profile_section-label">Your stats</p>
          <div className="profile_stats">
            <div className="profile_stat">
              <span className="profile_stat-value">
                {String(stats.destinations).padStart(2, "0")}
              </span>
              <span className="profile_stat-label">Destinations</span>
            </div>
            <div className="profile_stat">
              <span className="profile_stat-value">
                {stats.yearsShooting > 0 ? `${stats.yearsShooting}+` : "—"}
              </span>
              <span className="profile_stat-label">Years shooting</span>
            </div>
            <div className="profile_stat">
              <span className="profile_stat-value">
                {stats.totalPhotos > 0 ? `${stats.totalPhotos}+` : "—"}
              </span>
              <span className="profile_stat-label">Frames kept</span>
            </div>
          </div>
        </motion.div>

        <form className="profile_form" onSubmit={handleSave} noValidate>
          {error && (
            <p className="profile_error" role="alert">
              {error}
            </p>
          )}

          {/* ----- Bio ----- */}
          <motion.div className="profile_section" {...fadeUp(0.28)}>
            <p className="profile_section-label">About me</p>
            <textarea
              className="profile_textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a few sentences about yourself and your photography…"
              rows={5}
            />
            <p className="profile_hint">
              Shown on the About page. Use a blank line to separate paragraphs.
            </p>
          </motion.div>

          {/* ----- Quote ----- */}
          <motion.div className="profile_section" {...fadeUp(0.34)}>
            <p className="profile_section-label">Favourite quote</p>
            <input
              className="profile_input"
              type="text"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="e.g. The camera is an excuse to be someplace you otherwise don&#39;t belong."
            />
          </motion.div>

          {/* ----- Gear ----- */}
          <motion.div className="profile_section" {...fadeUp(0.4)}>
            <p className="profile_section-label">Current kit</p>
            <div className="profile_gear-tags">
              {gear.map((item) => (
                <span key={item} className="profile_gear-tag">
                  {item}
                  <button
                    type="button"
                    className="profile_gear-remove"
                    onClick={() => removeGear(item)}
                    aria-label={`Remove ${item}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="profile_gear-input-row">
              <input
                className="profile_input"
                type="text"
                value={gearInput}
                onChange={(e) => setGearInput(e.target.value)}
                onKeyDown={handleGearKey}
                placeholder="e.g. Fujifilm X-T5"
              />
              <button
                type="button"
                className="profile_gear-add"
                onClick={addGear}
              >
                Add
              </button>
            </div>
            <p className="profile_hint">
              Press Enter or click Add. Shown as tags on the About page.
            </p>
          </motion.div>

          {/* ----- Interests ----- */}
          <motion.div className="profile_section" {...fadeUp(0.46)}>
            <div className="profile_section-head">
              <p className="profile_section-label">Interests</p>
              <button
                type="button"
                className="profile_add-interest"
                onClick={addInterest}
              >
                + Add interest
              </button>
            </div>
            <p className="profile_hint" style={{ marginBottom: "1rem" }}>
              Each card appears on the Interests page in the same 3-column grid
              format.
            </p>

            {interests.length === 0 && (
              <p className="profile_empty-hint">
                No interests yet — click "+ Add interest" to create your first
                card.
              </p>
            )}

            <div className="profile_interests-list">
              {interests.map((it, i) => (
                <div key={it.id} className="profile_interest-card">
                  <div className="profile_interest-card-head">
                    <span className="profile_interest-index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      className="profile_interest-remove"
                      onClick={() => removeInterest(it.id)}
                      aria-label="Remove interest"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    className="profile_input profile_interest-title"
                    type="text"
                    value={it.title}
                    onChange={(e) =>
                      updateInterest(it.id, "title", e.target.value)
                    }
                    placeholder="Interest title"
                  />
                  <textarea
                    className="profile_textarea profile_interest-body"
                    value={it.body}
                    onChange={(e) =>
                      updateInterest(it.id, "body", e.target.value)
                    }
                    placeholder="Describe this interest in a sentence or two…"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ----- Save bar ----- */}
          <motion.div className="profile_save-bar" {...fadeUp(0.5)}>
            {saved && (
              <span className="profile_saved-msg">Changes saved ✓</span>
            )}
            <button
              type="submit"
              className="profile_save-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="auth-spinner" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </main>
  );
}
