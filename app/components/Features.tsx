'use client';

import { useEffect, useRef } from 'react';
import { FEATURES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const { t } = useLanguage();
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const featureKeys = [
    { titleKey: 'features.premium.title', descKey: 'features.premium.description' },
    { titleKey: 'features.experts.title', descKey: 'features.experts.description' },
    { titleKey: 'features.relaxing.title', descKey: 'features.relaxing.description' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Features stagger animation
      gsap.fromTo(".feature-item", 
        {
          y: 60,
          opacity: 0,
          scale: 0.8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, featuresRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <div ref={featuresRef} className="grid grid-cols-3 gap-6 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto px-4">
      {FEATURES.map((feature, index) => (
        <div key={index} className="feature-item text-center group">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-3 sm:mb-3 group-hover:scale-110 transition-transform duration-300 mx-auto">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.iconPath} />
            </svg>
          </div>
          <h3 className="text-secondary text-[10px] sm:text-sm md:text-base font-medium mb-1 leading-tight">
            {t(featureKeys[index].titleKey)}
          </h3>
          <p className="text-secondary/60 text-[9px] sm:text-sm hidden sm:block">
            {t(featureKeys[index].descKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
