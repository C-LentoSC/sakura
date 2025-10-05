'use client';

import { useEffect, useRef } from 'react';
import { PETAL_ANIMATIONS } from '../constants';
import { gsap } from 'gsap';

export default function FallingPetals() {
  const petalsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial positions for petals
      gsap.set(".petal", {
        y: -100,
        opacity: 0,
        rotation: 0,
        scale: 1,
      });

      // Create individual animations for each petal
      const petals = gsap.utils.toArray(".petal") as Element[];
      petals.forEach((petal) => {
        // Main falling animation
        gsap.to(petal, {
          y: window.innerHeight + 100,
          opacity: 0.9,
          rotation: 360 + Math.random() * 360,
          duration: 6 + Math.random() * 4,
          ease: "none",
          repeat: -1,
          delay: Math.random() * 3,
          repeatDelay: Math.random() * 2,
        });

        // Swaying motion
        gsap.to(petal, {
          x: `+=${20 + Math.random() * 40}`,
          duration: 2 + Math.random() * 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 2,
        });

        // Scale pulsing
        gsap.to(petal, {
          scale: 0.8 + Math.random() * 0.4,
          duration: 1 + Math.random() * 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 3,
        });
      });

    }, petalsRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={petalsRef} className="fixed inset-0 pointer-events-none z-20">
      {PETAL_ANIMATIONS.map((petal, i) => (
        <div
          key={i}
          className="petal absolute"
          style={{
            left: petal.x,
            top: petal.y,
          }}
        >
          <svg 
            className="w-3 h-4 sm:w-4 sm:h-5 lg:w-5 lg:h-6" 
            viewBox="0 0 20 25"
          >
            <ellipse
              cx="10"
              cy="12"
              rx="8"
              ry="10"
              fill="#FFB7C5"
              opacity="0.6"
              transform="rotate(15 10 12)"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}
