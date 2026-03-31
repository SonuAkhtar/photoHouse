import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trips } from "../../data/trips";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = trips.map((t) => t.place);

interface HeroProps {
  count?: number;
}

export default function Hero({ count }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const photo1Ref = useRef<HTMLDivElement>(null);
  const photo2Ref = useRef<HTMLDivElement>(null);
  const photo3Ref = useRef<HTMLDivElement>(null);

  const covers = trips.slice(0, 3);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".hero__topbar", { y: -32, opacity: 0, duration: 1 }, 0.05)
        .from(
          ".hero__ch",
          {
            y: "120%",
            opacity: 0,
            duration: 1.2,
            stagger: { amount: 0.4, from: "start" },
          },
          0.2,
        )
        .from(
          ".hero__rule",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "expo.inOut",
          },
          "-=0.35",
        )

        .from(".hero__tagline", { y: 22, opacity: 0, duration: 0.85 }, "-=0.6")
        .from(".hero__count", { y: 18, opacity: 0, duration: 0.7 }, "-=0.45")

        .from(
          ".hero__photo--1",
          {
            clipPath: "inset(0 100% 0 0)",
            scale: 1.06,
            opacity: 0,
            duration: 1.4,
            ease: "expo.inOut",
          },
          0.3,
        )
        .from(
          ".hero__photo--2",
          {
            clipPath: "inset(0 100% 0 0)",
            scale: 1.06,
            opacity: 0,
            duration: 1.25,
            ease: "expo.inOut",
          },
          0.48,
        )
        .from(
          ".hero__photo--3",
          {
            clipPath: "inset(0 100% 0 0)",
            scale: 1.06,
            opacity: 0,
            duration: 1.25,
            ease: "expo.inOut",
          },
          0.64,
        )

        .from(".hero__scroll", { opacity: 0, y: 16, duration: 0.7 }, "-=0.25")
        .from(".hero__marquee-wrap", { opacity: 0, duration: 1.0 }, "-=0.35");

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate(self) {
          const p = self.progress;
          gsap.set(".hero__wordmark", { y: p * 100 });
          gsap.set(".hero__collage", { y: p * -60 });
          gsap.set(".hero__sub", { opacity: 1 - p * 2.2, y: p * 40 });
          gsap.set(".hero__count", { opacity: 1 - p * 3 });
        },
      });
    }, sectionRef);

    const photos = [photo1Ref.current!, photo2Ref.current!, photo3Ref.current!];
    const depthsX = [-22, 14, -10];
    const depthsY = [-16, 20, 12];

    const setters = photos.map((p) => ({
      x: gsap.quickSetter(p, "x", "px"),
      y: gsap.quickSetter(p, "y", "px"),
    }));

    let mouse = { x: 0, y: 0 };
    let lerped = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.y = (e.clientY - rect.top) / rect.height - 0.5;

      section.style.setProperty(
        "--cx",
        `${((e.clientX - rect.left) / rect.width) * 100}%`,
      );
      section.style.setProperty(
        "--cy",
        `${((e.clientY - rect.top) / rect.height) * 100}%`,
      );
    };

    const ticker = gsap.ticker.add(() => {
      const f = 0.075;
      lerped.x += (mouse.x - lerped.x) * f;
      lerped.y += (mouse.y - lerped.y) * f;
      setters.forEach((s, i) => {
        s.x(lerped.x * depthsX[i]);
        s.y(lerped.y * depthsY[i]);
      });
    });

    window.addEventListener("mousemove", onMove);

    photos.forEach((photo) => {
      const onPhotoMove = (e: MouseEvent) => {
        const r = photo.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(photo, {
          rotateY: x * 20,
          rotateX: -y * 16,
          duration: 0.35,
          ease: "power2.out",
          transformPerspective: 900,
          overwrite: "auto",
        });
      };
      const onPhotoLeave = () => {
        gsap.to(photo, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
          overwrite: "auto",
        });
      };
      photo.addEventListener("mousemove", onPhotoMove);
      photo.addEventListener("mouseleave", onPhotoLeave);
    });

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  useEffect(() => {
    if (count === undefined || count === 0) return;
    const tween = gsap.to(
      { n: 0 },
      {
        n: count,
        duration: 1.5,
        delay: 0.8,
        ease: "power3.out",
        onUpdate() {
          if (countRef.current) {
            countRef.current.textContent = String(
              Math.round((this as any).targets()[0].n),
            ).padStart(2, "0");
          }
        },
      },
    );
    return () => {
      tween.kill();
    };
  }, [count]);

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__spotlight" aria-hidden="true" />

      <div className="hero__topbar">
        <span className="hero__label">A visual archive</span>
        <span className="hero__label hero__label--right">Est. 2023</span>
      </div>

      <div className="hero__body">
        <div className="hero__text-col">
          <div className="hero__wordmark" aria-label="Trip House">
            {["TRIP", "HOUSE"].map((word, wi) => (
              <div key={wi} className="hero__line">
                {word.split("").map((ch, li) => (
                  <span key={`${wi}-${li}`} className="hero__ch">
                    {ch}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="hero__sub">
            <div className="hero__rule" />
            <p className="hero__tagline">
              A curated collection of journeys —<br />
              landscapes, light, and the in-between.
            </p>
          </div>

          <div className="hero__count">
            <span className="hero__count-num" ref={countRef}>
              00
            </span>
            <span className="hero__count-label">
              Journeys
              <br />
              Documented
            </span>
          </div>
        </div>

        <div className="hero__collage">
          <div ref={photo1Ref} className="hero__photo hero__photo--1">
            <img
              src={covers[0].cover}
              alt={covers[0].place}
              draggable={false}
            />
            <span className="hero__photo-label">{covers[0].place}</span>
            <div className="hero__photo-sheen" aria-hidden="true" />
          </div>

          <div ref={photo2Ref} className="hero__photo hero__photo--2">
            <img
              src={covers[1].cover}
              alt={covers[1].place}
              draggable={false}
            />
            <span className="hero__photo-label">{covers[1].place}</span>
            <div className="hero__photo-sheen" aria-hidden="true" />
          </div>

          <div ref={photo3Ref} className="hero__photo hero__photo--3">
            <img
              src={covers[2].cover}
              alt={covers[2].place}
              draggable={false}
            />
            <span className="hero__photo-label">{covers[2].place}</span>
            <div className="hero__photo-sheen" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>

      <div className="hero__marquee-wrap" aria-hidden="true">
        <div className="hero__marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
            (place, i) => (
              <span key={i} className="hero__marquee-item">
                {place}
                <span className="hero__marquee-sep">◆</span>
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
