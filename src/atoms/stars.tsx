"use client";

import { useEffect, useState } from "react";

const TOTAL_NUM_STARS = 300;

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

const STAR_COLORS = [
  "rgba(255, 255, 255, 0.9)",
  "rgba(255, 255, 255, 0.8)",
  "rgba(255, 255, 255, 0.7)",
  "rgba(255, 255, 255, 0.6)",
  "rgba(200, 220, 255, 0.7)",
  "rgba(200, 220, 255, 0.6)",
  "rgba(255, 210, 180, 0.6)",
  "rgba(255, 180, 180, 0.5)",
];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.pow(Math.random(), 0.6) * 100,
    size: Math.random() < 0.85 ? 1 : 1.5,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!,
    delay: Math.random() * 8,
    duration: 2 + Math.random() * 4,
  }));
}

export function Stars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setStars(generateStars(TOTAL_NUM_STARS));
    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (stars.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 3s ease-in",
      }}
    >
      {stars.map((star, i) => {
        const t = star.y / 100;
        const twinkleMin = 0.6 - t * 0.57;
        const twinkleMax = 1.0 - t * 0.92;
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={
              {
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                backgroundColor: star.color,
                "--twinkle-min": twinkleMin,
                "--twinkle-max": twinkleMax,
                animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite backwards`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
