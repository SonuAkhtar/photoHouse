import { useEffect, useRef, useState } from "react";
import "./FullscreenGallery.css";

import type { Photo } from "../../data/trips";

interface Props {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function FullscreenGallery({
  photos,
  initialIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [animDir, setAnimDir] = useState<"next" | "prev" | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const goTo = (newIndex: number, dir: "next" | "prev") => {
    setAnimDir(dir);
    setAnimKey((k) => k + 1);
    setIndex(newIndex);
  };

  const goNext = () => goTo((index + 1) % photos.length, "next");
  const goPrev = () =>
    goTo((index - 1 + photos.length) % photos.length, "prev");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    overlayRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 48) {
      delta < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  const photo = photos[index];
  const animClass = animDir ? ` fsg-img--${animDir}` : "";

  return (
    <div
      className="fsg-overlay"
      ref={overlayRef}
      tabIndex={-1}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-modal="true"
      role="dialog"
      aria-label="Fullscreen gallery"
    >
      <button
        className="fsg-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        ✕
      </button>

      <div className="fsg-stage">
        <img
          key={`${index}-${animKey}`}
          src={photo.url}
          alt={photo.caption}
          className={`fsg-img${animClass}`}
          draggable={false}
        />
      </div>

      <button
        className="fsg-nav fsg-nav--prev"
        onClick={goPrev}
        aria-label="Previous photo"
      >
        ‹
      </button>
      <button
        className="fsg-nav fsg-nav--next"
        onClick={goNext}
        aria-label="Next photo"
      >
        ›
      </button>

      <div className="fsg-footer">
        <span className="fsg-caption">{photo.caption}</span>
        <span className="fsg-counter">
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(photos.length).padStart(2, "0")}
        </span>
      </div>

      <div className="fsg-thumbs">
        {photos.map((p, i) => (
          <button
            key={i}
            className={`fsg-thumb${i === index ? " fsg-thumb--active" : ""}`}
            onClick={() => goTo(i, i > index ? "next" : "prev")}
            aria-label={p.caption}
          >
            <img src={p.url} alt={p.caption} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
