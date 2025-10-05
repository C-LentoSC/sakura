'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { gsap } from 'gsap';

export default function HeroSection() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial setup - hide elements with more dramatic starting positions
      gsap.set([quoteRef.current, titleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 80,
        scale: 0.95,
      });

      // Create timeline for sequential animations with smoother timing
      const tl = gsap.timeline({ delay: 0.3 });

      // Quote animation - gentle and elegant
      tl.to(quoteRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      })
      // Title animation - smooth and impactful
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
      }, "-=0.6")
      // Buttons animation - soft entrance
      .to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      }, "-=0.5");

    }, heroRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <div ref={heroRef} className="text-center px-4 sm:px-0">
      {/* Decorative Quote Above Title */}
      <div ref={quoteRef} className="mb-4 sm:mb-4">
        <p className="text-secondary/60 text-[10px] sm:text-sm italic font-light tracking-wider">
          &ldquo;{t('hero.quote')}&rdquo;
        </p>
        <div className="flex items-center justify-center mt-2 sm:mt-2">
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          <div className="mx-2">
            <svg className="w-2 h-2 sm:w-3 sm:h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        </div>
      </div>

      {/* Main Title */}
      <div ref={titleRef} className="mb-6 sm:mb-6">
        <h1 className="font-sakura ">
          <span className="text-[4.5rem] sm:text-[12rem] md:text-9xl lg:text-[14rem] xl:text-[16rem] 2xl:text-[18rem] text-secondary leading-none">{t('hero.title')}</span>
          <span className="block text-[3rem] sm:text-6xl md:text-7xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] tracking-widest leading-none mt-[-0.5rem] sm:mt-0">{t('hero.subtitle')}</span>
        </h1>
        
        <p className="text-secondary/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-xs sm:max-w-md lg:max-w-xl mx-auto mt-4 sm:mt-4 px-2">
          {t('hero.description')}
        </p>
      </div>

      {/* Action Buttons */}
      <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-8">
        <button className="sakura-button w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-8 py-3 sm:py-2.5 border-2 border-primary text-primary text-sm sm:text-base font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
          {t('hero.booking')}
        </button>
        <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-8 py-3 sm:py-2.5 text-secondary/70 text-sm sm:text-base font-medium hover:text-primary transition-all duration-300 hover:scale-105">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          {t('hero.story')}
        </button>
      </div>
    </div>
  );
}
