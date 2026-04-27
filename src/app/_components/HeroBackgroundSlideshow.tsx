"use client";

import * as React from "react";

const HERO_IMAGE_SEQUENCE = [
  "/images/hero/clio-hero-1.png",
  "/images/hero/clio-hero-2.png",
  "/images/hero/clio-hero-3.png",
  "/images/hero/clio-hero-4.png",
  "/images/hero/clio-hero-3.png",
  "/images/hero/clio-hero-2.png",
];

const SLIDE_INTERVAL_MS = 10000;
const FADE_DURATION_MS = 5500;

export function HeroBackgroundSlideshow() {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        currentIndex === HERO_IMAGE_SEQUENCE.length - 1 ? 0 : currentIndex + 1
      );
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {HERO_IMAGE_SEQUENCE.map((image, index) => {
        const isActive = index === activeImageIndex;

        return (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              opacity: isActive ? 0.92 : 0,
              transform: isActive ? "scale(1.035)" : "scale(1.015)",
              transition: `opacity ${FADE_DURATION_MS}ms ease-in-out, transform ${SLIDE_INTERVAL_MS}ms ease-in-out`,
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,250,240,0.18),rgba(247,241,230,0.3)_58%,rgba(247,241,230,0.42))]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(247,243,252,0.04),rgba(251,239,208,0.04),rgba(255,250,240,0.08))]" />
    </div>
  );
}