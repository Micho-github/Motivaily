"use client";

import React, { useState, useEffect } from "react";
import styles from "@/components/animations/animation.module.css";

export default function Component() {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFillPercentage((prev) => {
        if (prev >= 100) {
          setIsGlowing(true);
          setTimeout(() => {
            setIsGlowing(false);
            setFillPercentage(0); // Reset fillPercentage to 0 after the glow effect
          }, 3000); // Duration of the glowing effect
          return 100;
        }
        return prev + 2; // Increase fillPercentage by 2
      });
    }, 50); // Faster interval time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div
        className={`relative w-64 h-64 ${
          isGlowing ? `${styles.glow_scale}` : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 128 128"
          className="w-full h-full"
        >
          <defs>
            <clipPath id="leafClip">
              <path
                d="M30.545 28.822C29.38 36.039 30.875 43.672 37.045 47.863 30.758 19.81 45.756 8.664 59.646 1 43.466 24.046 76.542 24.644 78.423 51.13 80.028 73.71 64.507 91.317 46.639 99 46.845 76.175 24.089 73.067 21.801 54.397 20.905 47.094 25.062 33.766 30.545 28.822"
                transform="scale(0.4703196347031963) translate(71.2,26)"
              />
            </clipPath>
          </defs>
          <g clipPath="url(#leafClip)">
            <rect x="0" y="0" width="128" height="128" fill="#46d01444" />
            <rect
              x="0"
              y={128 - (128 * fillPercentage) / 100}
              width="128"
              height={(128 * fillPercentage) / 100}
              fill="#46d014"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
