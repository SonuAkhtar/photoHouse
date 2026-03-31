import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FormEvent,
  type DragEvent,
} from "react";
import { createTrip, type ApiTrip } from "../../services/api";
import "./UploadModal.css";

interface Props {
  onClose: () => void;
  onCreated: (trip: ApiTrip) => void;
}

type UploadMode = "single" | "multiple";

interface PhotoEntry {
  file: File;
  preview: string;
  caption: string;
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

export default function UploadModal({ onClose, onCreated }: Props) {
  const [mode, setMode] = useState<UploadMode>("multiple");
  const [place, setPlace] = useState("");
  const [region, setRegion] = useState("");
  const [dates, setDates] = useState("");
  const [summary, setSummary] = useState("");
  const [accent, setAccent] = useState(ACCENT_PRESETS[0]);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (incoming.length === 0) {
      setError("Please select image files only.");
      return;
    }
    const toAdd = mode === "single" ? incoming.slice(0, 1) : incoming;
    const entries: PhotoEntry[] = toAdd.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      caption: "",
    }));

    setPhotos((prev) => (mode === "single" ? entries : [...prev, ...entries]));
    setError("");
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removePhoto = (i: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const updateCaption = (i: number, value: string) => {
    setPhotos((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, caption: value } : p)),
    );
  };

  const handleModeChange = (newMode: UploadMode) => {
    setMode(newMode);
    if (newMode === "single" && photos.length > 1) {
      photos.slice(1).forEach((p) => URL.revokeObjectURL(p.preview));
      setPhotos((prev) => [prev[0]]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!place.trim() || !region.trim() || !dates.trim() || !summary.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (photos.length === 0) {
      setError("Please add at least one photo.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("place", place.trim());
      fd.append("region", region.trim());
      fd.append("dates", dates.trim());
      fd.append("summary", summary.trim());
      fd.append("accent", accent);

      const captions = photos.map((p) => p.caption);
      fd.append("captions", JSON.stringify(captions));

      photos.forEach((p) => fd.append("photos", p.file));

      const { data } = await createTrip(fd);
      photos.forEach((p) => URL.revokeObjectURL(p.preview));
      onCreated(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="upload-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="upload-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add a memory"
      >
        <div className="upload-modal_head">
          <div>
            <h2 className="upload-modal_title">Add a memory</h2>
            <p className="upload-modal_subtitle">Document your travel story</p>
          </div>
          <button
            className="upload-modal_close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form className="upload-modal_form" onSubmit={handleSubmit} noValidate>
          {error && (
            <p className="upload-modal_error" role="alert">
              {error}
            </p>
          )}

          <fieldset className="upload-modal_section">
            <legend className="upload-modal_section-title">Trip details</legend>

            <div className="upload-modal_row">
              <div className="upload-modal_field">
                <label className="upload-modal_label" htmlFor="up-place">
                  Place name <span className="upload-modal_req">*</span>
                </label>
                <input
                  id="up-place"
                  className="upload-modal_input"
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="e.g. Santorini"
                  required
                />
              </div>

              <div className="upload-modal_field">
                <label className="upload-modal_label" htmlFor="up-region">
                  Region / Country <span className="upload-modal_req">*</span>
                </label>
                <input
                  id="up-region"
                  className="upload-modal_input"
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Cyclades · Greece"
                  required
                />
              </div>
            </div>

            <div className="upload-modal_field">
              <label className="upload-modal_label" htmlFor="up-dates">
                Travel dates <span className="upload-modal_req">*</span>
              </label>
              <input
                id="up-dates"
                className="upload-modal_input"
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="e.g. June 14 – 21, 2024"
                required
              />
            </div>

            <div className="upload-modal_field">
              <label className="upload-modal_label" htmlFor="up-summary">
                Description <span className="upload-modal_req">*</span>
              </label>
              <textarea
                id="up-summary"
                className="upload-modal_textarea"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A few sentences about this journey - the light, the feeling, what made it memorable…"
                rows={3}
                required
              />
            </div>

            <div className="upload-modal_field">
              <label className="upload-modal_label">Accent colour</label>
              <div className="upload-modal_accent-row">
                {ACCENT_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`upload-modal_accent-swatch${accent === c ? " upload-modal_accent-swatch-active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setAccent(c)}
                    aria-label={`Accent ${c}`}
                    aria-pressed={accent === c}
                  />
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="upload-modal_section">
            <legend className="upload-modal_section-title">Photos</legend>

            <div className="upload-modal_mode-row">
              <button
                type="button"
                className={`upload-modal_mode-btn${mode === "single" ? " upload-modal_mode-btn-active" : ""}`}
                onClick={() => handleModeChange("single")}
              >
                Single photo
              </button>
              <button
                type="button"
                className={`upload-modal_mode-btn${mode === "multiple" ? " upload-modal_mode-btn-active" : ""}`}
                onClick={() => handleModeChange("multiple")}
              >
                Multiple photos
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={mode === "multiple"}
              onChange={handleFileInput}
              className="upload-modal_file-input"
              tabIndex={-1}
            />

            {photos.length === 0 && (
              <div
                className={`upload-modal_dropzone${dragging ? " upload-modal_dropzone-active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && fileInputRef.current?.click()
                }
                aria-label="Click or drag photos here"
              >
                <span className="upload-modal_drop-icon">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <p className="upload-modal_drop-text">
                  {dragging
                    ? "Drop photos here"
                    : "Click or drag to add photos"}
                </p>
                <p className="upload-modal_drop-hint">
                  JPEG, PNG, WebP - up to 10 MB each
                  {mode === "multiple" ? " · up to 20 photos" : " · 1 photo"}
                </p>
              </div>
            )}

            {photos.length > 0 && (
              <div className="upload-modal_previews">
                {photos.map((p, i) => (
                  <div key={i} className="upload-modal_preview-item">
                    <div className="upload-modal_preview-img-wrap">
                      <img
                        src={p.preview}
                        alt={`Photo ${i + 1}`}
                        className="upload-modal_preview-img"
                      />
                      {i === 0 && (
                        <span className="upload-modal_cover-badge">Cover</span>
                      )}
                      <button
                        type="button"
                        className="upload-modal_remove-btn"
                        onClick={() => removePhoto(i)}
                        aria-label={`Remove photo ${i + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                    <input
                      className="upload-modal_caption-input"
                      type="text"
                      value={p.caption}
                      onChange={(e) => updateCaption(i, e.target.value)}
                      placeholder="Add a caption…"
                    />
                  </div>
                ))}

                {mode === "multiple" && photos.length < 20 && (
                  <button
                    type="button"
                    className="upload-modal_add-more"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span>+</span>
                    <span>Add more</span>
                  </button>
                )}
              </div>
            )}
          </fieldset>

          <div className="upload-modal_actions">
            <button
              type="button"
              className="upload-modal_cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="upload-modal_save"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" /> Uploading…
                </>
              ) : (
                "Save memory"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
