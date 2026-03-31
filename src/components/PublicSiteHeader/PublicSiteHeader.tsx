import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme, themeList } from "../../context/ThemeContext";
import { usePub } from "../../context/PublicProfileContext";
import "../SiteHeader/SiteHeader.css";
import "./PublicSiteHeader.css";

export default function PublicSiteHeader() {
  const { theme, setTheme } = useTheme();
  const { username, user } = usePub();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const active = themeList.find((t) => t.id === theme)!;
  const base = `/u/${username}`;

  const navLinks = [
    { label: "All Trips", href: `${base}/trips` },
    { label: "Map", href: `${base}/map` },
    { label: "Stats", href: `${base}/stats` },
    { label: "About Me", href: `${base}/about` },
    { label: "Interests", href: `${base}/interests` },
  ];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
      if (!avatarRef.current?.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMobileOpen(false);
    setPickerOpen(false);
    setAvatarOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="site-header">
        <Link
          to={base}
          className="site-header_logo"
          aria-label="Trip House - home"
        >
          <span className="site-header_logo-mark" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2.5 L22 10 L22 22 L2 22 L2 10 Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <line
                x1="2"
                y1="10"
                x2="22"
                y2="10"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <circle
                cx="12"
                cy="16.5"
                r="4.8"
                stroke="currentColor"
                strokeWidth="1.1"
              />
              <circle
                cx="12"
                cy="16.5"
                r="2.2"
                stroke="currentColor"
                strokeWidth="0.9"
              />
              <circle cx="12" cy="16.5" r="0.7" fill="currentColor" />
              <line
                x1="13.56"
                y1="14.94"
                x2="14.97"
                y2="13.53"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <line
                x1="13.56"
                y1="18.06"
                x2="14.97"
                y2="19.47"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <line
                x1="10.44"
                y1="18.06"
                x2="9.03"
                y2="19.47"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <line
                x1="10.44"
                y1="14.94"
                x2="9.03"
                y2="13.53"
                stroke="currentColor"
                strokeWidth="0.85"
              />
            </svg>
          </span>
          <span className="site-header_logo-text">
            <span className="site-header_logo-h">Trip</span>
            <span className="site-header_logo-p">house</span>
          </span>
        </Link>

        <nav className="site-header_nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`site-header_link${location.pathname === link.href ? " site-header_link-active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header_controls">
          <div className="site-header_right" ref={pickerRef}>
            <button
              className="site-header_theme-btn"
              onClick={() => setPickerOpen((o) => !o)}
              aria-label="Change theme"
              aria-expanded={pickerOpen}
            >
              <span className="site-header_theme-swatches">
                {active.swatches.map((c, i) => (
                  <span
                    key={i}
                    className="site-header_theme-swatch"
                    style={{ background: c }}
                  />
                ))}
              </span>
              <span className="site-header_theme-name">{active.name}</span>
              <span
                className={`site-header_theme-chevron${pickerOpen ? " site-header_theme-chevron-open" : ""}`}
              >
                ›
              </span>
            </button>

            <AnimatePresence>
              {pickerOpen && (
                <motion.div
                  className="theme-picker"
                  initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.94 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ transformOrigin: "top right" }}
                >
                  {themeList.map((t) => (
                    <button
                      key={t.id}
                      className={`theme-picker_item${t.id === theme ? " theme-picker_item-active" : ""}`}
                      onClick={() => {
                        setTheme(t.id);
                        setPickerOpen(false);
                      }}
                    >
                      <span className="theme-picker_swatches">
                        {t.swatches.map((c, i) => (
                          <span
                            key={i}
                            className="theme-picker_swatch"
                            style={{ background: c }}
                          />
                        ))}
                      </span>
                      <span className="theme-picker_info">
                        <span className="theme-picker_name">{t.name}</span>
                        <span className="theme-picker_desc">{t.desc}</span>
                      </span>
                      {t.id === theme && (
                        <span className="theme-picker_check">✓</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pub-avatar-wrap" ref={avatarRef}>
            <button
              className="site-header_user-btn"
              onClick={() => setAvatarOpen((o) => !o)}
              aria-label={`Photographer: ${user.name}`}
              aria-expanded={avatarOpen}
              title={user.name}
            >
              {(user.name?.charAt(0) || "?").toUpperCase()}
            </button>
            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  className="pub-avatar-card"
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{
                    duration: 0.18,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <p className="pub-avatar-card_name">{user.name}</p>
                  <p className="pub-avatar-card_username">@{username}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            className="site-header_burger"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span
              className={`site-header_burger-bar${mobileOpen ? " site-header_burger-bar-open" : ""}`}
            />
            <span
              className={`site-header_burger-bar${mobileOpen ? " site-header_burger-bar-open" : ""}`}
            />
            <span
              className={`site-header_burger-bar${mobileOpen ? " site-header_burger-bar-open" : ""}`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <nav className="mobile-menu_nav">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <Link
                    to={link.href}
                    className={`mobile-menu_link${location.pathname === link.href ? " mobile-menu_link-active" : ""}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="mobile-menu_link-index">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mobile-menu_themes">
              <p className="mobile-menu_theme-label">Theme</p>
              <div className="mobile-menu_theme-grid">
                {themeList.map((t) => (
                  <button
                    key={t.id}
                    className={`mobile-menu_theme-item${t.id === theme ? " mobile-menu_theme-item-active" : ""}`}
                    onClick={() => {
                      setTheme(t.id);
                      setMobileOpen(false);
                    }}
                  >
                    <span className="mobile-menu_theme-swatches">
                      {t.swatches.map((c, i) => (
                        <span
                          key={i}
                          style={{ background: c }}
                          className="mobile-menu_theme-swatch"
                        />
                      ))}
                    </span>
                    <span className="mobile-menu_theme-name">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mobile-menu_user">
              <p className="mobile-menu_user-name">{user.name}</p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-faint)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.08em",
                }}
              >
                @{username}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
