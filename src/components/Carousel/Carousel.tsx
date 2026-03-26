import { useEffect, useRef, useState } from "react";
import "./Carousel.css";

// packages
import { AnimatePresence } from "framer-motion";
import FullscreenGallery from "../FullscreenGallery/FullscreenGallery";

// data
import type { Photo } from "../../data/trips";

interface CarouselProps {
  photos: Photo[];
}

type Direction = "next" | "prev";

export default function Carousel({ photos }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("next");
  const [transitioning, setTransitioning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const goTo = (newIndex: number, dir: Direction) => {
    if (transitioning || newIndex === current) return;
    setPrevious(current);
    setCurrent(newIndex);
    setDirection(dir);
    setTransitioning(true);
    setTimeout(() => {
      setPrevious(null);
      setTransitioning(false);
    }, 700);

    const thumb = thumbsRef.current?.children[newIndex] as
      | HTMLElement
      | undefined;
    thumb?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const goNext = () => goTo((current + 1) % photos.length, "next");
  const goPrev = () =>
    goTo((current - 1 + photos.length) % photos.length, "prev");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, transitioning]);

  return (
    <>
      <div className="carousel">
        <div className="carousel_stage-wrap">
          <div
            className="carousel_stage"
            onClick={() => setFullscreen(true)}
            role="button"
            tabIndex={0}
            aria-label="Open fullscreen gallery"
            onKeyDown={(e) => e.key === "Enter" && setFullscreen(true)}
          >
            {previous !== null && (
              <img
                key={`prev-${previous}`}
                src={photos[previous].url}
                alt={photos[previous].caption}
                className={`carousel_img carousel_img-exit-${direction}`}
              />
            )}
            <img
              key={`curr-${current}`}
              src={photos[current].url}
              alt={photos[current].caption}
              className={`carousel_img carousel_img-enter-${direction}`}
            />

            <button
              className="carousel_nav carousel_nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              className="carousel_nav carousel_nav-next"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          </div>

          <div className="carousel_caption-bar">
            <span className="carousel_caption">{photos[current].caption}</span>
            <span className="carousel_counter">
              {String(current + 1).padStart(2, "0")} /{" "}
              {String(photos.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="carousel_thumbs" ref={thumbsRef}>
          {photos.map((photo, i) => (
            <div
              key={i}
              className={`carousel_thumb${i === current ? " carousel_thumb-active" : ""}`}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              role="button"
              tabIndex={0}
              aria-label={photo.caption}
              onKeyDown={(e) =>
                e.key === "Enter" && goTo(i, i > current ? "next" : "prev")
              }
            >
              <img src={photo.url} alt={photo.caption} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <FullscreenGallery
            photos={photos}
            initialIndex={current}
            onClose={() => setFullscreen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
