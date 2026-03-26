import { useEffect, useState, useRef, type WheelEvent } from "react";
import "./Lightbox.css";

// packages
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.4;

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=")
        setZoom((z) =>
          Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(1))),
        );
      if (e.key === "-")
        setZoom((z) => {
          const n = Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(1)));
          if (n === 1) setOffset({ x: 0, y: 0 });
          return n;
        });
      if (e.key === "0") {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const zoomIn = () =>
    setZoom((z) => Math.min(MAX_ZOOM, parseFloat((z + ZOOM_STEP).toFixed(1))));
  const zoomOut = () =>
    setZoom((z) => {
      const n = Math.max(MIN_ZOOM, parseFloat((z - ZOOM_STEP).toFixed(1)));
      if (n === 1) setOffset({ x: 0, y: 0 });
      return n;
    });
  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragging.current = true;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => {
    dragging.current = false;
  };

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox"
        style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={(e) => {
          if (e.target === e.currentTarget && zoom === 1) onClose();
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.img
          className="lightbox_img"
          src={src}
          alt={alt}
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            cursor: zoom > 1 ? "grab" : "zoom-in",
            userSelect: "none",
          }}
          onDoubleClick={() => (zoom > 1 ? reset() : zoomIn())}
          draggable={false}
        />

        <button
          className="lightbox_close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ✕
        </button>

        {zoom > 1 && (
          <div className="lightbox_zoom-controls">
            <button onClick={zoomOut} aria-label="Zoom out">
              −
            </button>
            <span>{Math.round(zoom * 100)}%</span>
            <button onClick={zoomIn} aria-label="Zoom in">
              +
            </button>
            <button onClick={reset} aria-label="Reset zoom">
              ↺
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
