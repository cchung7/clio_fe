"use client";

import Image from "next/image";
import * as React from "react";

import {
  HERO_IMAGE_SEQUENCE,
  HOME_HERO_SLIDESHOW_TIMING,
} from "../constants/homeHeroContent";

export function HeroBackgroundSlideshow() {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) =>
        currentIndex === HERO_IMAGE_SEQUENCE.length - 1 ? 0 : currentIndex + 1
      );
    }, HOME_HERO_SLIDESHOW_TIMING.slideIntervalMs);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {HERO_IMAGE_SEQUENCE.map((image, index) => {
        const isActive = index === activeImageIndex;

        return (
          <Image
            key={`${image}-${index}`}
            src={image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
            style={{
              opacity: isActive ? 0.92 : 0,
              transform: isActive ? "scale(1.035)" : "scale(1.015)",
              transition: `opacity ${HOME_HERO_SLIDESHOW_TIMING.fadeDurationMs}ms ease-in-out, transform ${HOME_HERO_SLIDESHOW_TIMING.slideIntervalMs}ms ease-in-out`,
            }}
          />
        );
      })}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,250,240,0.18),rgba(247,241,230,0.3)_58%,rgba(247,241,230,0.42))]" />

      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(247,243,252,0.04),rgba(251,239,208,0.04),rgba(255,250,240,0.08))]" />
    </div>
  );
}