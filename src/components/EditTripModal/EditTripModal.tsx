import { useState, type FormEvent, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { updateTrip, type ApiTrip } from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./EditTripModal.css";

interface Props {
  trip: ApiTrip;
  onClose: () => void;
  onUpdated: (trip: ApiTrip) => void;
}

const ACCENT_PRESETS = [
  "#89B4C8",
  "#D4A0B0",
  "#E8B87A",
  "#C87D5A",
  "#7ABAB0",
  "#5E9E8F",
  "#C4A882",
  "#E8A05C",
  "#7DAF6E",
  "#D0765A",
  "#C4956A",
  "#8BA8B4",
  "#58B4C8",
  "#7A9E72",
  "#9898B4",
];

export default function EditTripModal({ trip, onClose, onUpdated }: Props) {
  const { toast } = useToast();

  const [place, setPlace] = useState(trip.place);
  const [region, setRegion] = useState(trip.region);
  const [dates, setDates] = useState(trip.dates);
  const [summary, setSummary] = useState(trip.summary);
  const [accent, setAccent] = useState(trip.accent);
  const [tags, setTags] = useState<string[]>(trip.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (!val || tags.includes(val) || tags.length >= 5) return;
    setTags((prev) => [...prev, val]);
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setTags((prev) => prev.filter((x) => x !== t));

  const handleTagKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!place.trim() || !region.trim() || !dates.trim() || !summary.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await updateTrip(trip.id, {
        place,
        region,
        dates,
        summary,
        accent,
        tags,
      });
      toast.success("Trip updated successfully.");
      onUpdated(data);
    } catch {
      toast.error("Failed to update trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="edit-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="edit-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Edit trip"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="edit-modal_head">
          <div>
            <h2 className="edit-modal_title">Edit Memory</h2>
            <p className="edit-modal_subtitle">{trip.place}</p>
          </div>
          <button
            className="edit-modal_close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="edit-modal_form" onSubmit={handleSubmit} noValidate>
          <div className="edit-modal_row">
            <div className="edit-modal_field">
              <label className="edit-modal_label">
                Place <span className="edit-modal_req">*</span>
              </label>
              <input
                className="edit-modal_input"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="e.g. Santorini"
              />
            </div>
            <div className="edit-modal_field">
              <label className="edit-modal_label">
                Region <span className="edit-modal_req">*</span>
              </label>
              <input
                className="edit-modal_input"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Cyclades · Greece"
              />
            </div>
          </div>

          <div className="edit-modal_field">
            <label className="edit-modal_label">
              Dates <span className="edit-modal_req">*</span>
            </label>
            <input
              className="edit-modal_input"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              placeholder="e.g. June 14 – 21, 2024"
            />
          </div>

          <div className="edit-modal_field">
            <label className="edit-modal_label">
              Description <span className="edit-modal_req">*</span>
            </label>
            <textarea
              className="edit-modal_textarea"
              rows={4}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Describe this trip…"
            />
          </div>

          <div className="edit-modal_field">
            <label className="edit-modal_label">
              Tags <span className="edit-modal_hint">(max 5)</span>
            </label>
            <div className="edit-modal_tags">
              {tags.map((t) => (
                <span key={t} className="edit-modal_tag">
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(t)}
                    aria-label={`Remove tag ${t}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="edit-modal_tag-row">
              <input
                className="edit-modal_input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder="e.g. landscape, street, portrait"
                disabled={tags.length >= 5}
              />
              <button
                type="button"
                className="edit-modal_tag-add"
                onClick={addTag}
                disabled={tags.length >= 5}
              >
                Add
              </button>
            </div>
          </div>

          <div className="edit-modal_field">
            <label className="edit-modal_label">Accent colour</label>
            <div className="edit-modal_accent-row">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`edit-modal_swatch${accent === c ? " edit-modal_swatch-active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setAccent(c)}
                  aria-label={`Select colour ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="edit-modal_actions">
            <button
              type="button"
              className="edit-modal_cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="edit-modal_save" disabled={saving}>
              {saving ? (
                <>
                  <span className="auth-spinner" /> Saving…
                </>
              ) : (
                "Save changes"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
