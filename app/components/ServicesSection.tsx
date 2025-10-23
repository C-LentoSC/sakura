'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      id: 'spa',
      titleKey: 'services.spa.title',
      descKey: 'services.spa.description',
      image: '/services-images/head-spa2.jpg',
    },
    {
      id: 'beauty',
      titleKey: 'services.beauty.title',
      descKey: 'services.beauty.description',
      image: '/services-images/nails.jpg',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation (guarded)
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Cards stagger animation (guarded)
      const cards = gsap.utils.toArray<HTMLElement>('.service-card');
      if (cards.length && cardsRef.current) {
        gsap.fromTo(
          cards,
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.2,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-amber-50/40 backdrop-blur-sm"></div>
      <div 
        className="absolute inset-0 backdrop-blur-xs" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 207, 232, 0.4) 0%, rgba(252, 231, 243, 0.3) 40%, rgba(255, 255, 255, 0) 80%)'
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16 sm:mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-sakura text-secondary mb-3 tracking-wide">
            {t('services.mainTitle')}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-12 h-0.5 bg-primary/40"></div>
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <div className="w-12 h-0.5 bg-primary/40"></div>
          </div>
        </div>

        {/* Service Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="service-card group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={service.image}
                  alt={t(service.titleKey)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-10">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl font-sakura text-secondary mb-4 group-hover:text-primary transition-colors duration-300">
                  {t(service.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-secondary/70 text-sm sm:text-base leading-relaxed mb-6">
                  {t(service.descKey)}
                </p>

                {/* Button */}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group/btn"
                >
                  <span>{t('services.contactButton')}</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-4 right-4 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg viewBox="0 0 50 50" className="w-full h-full text-primary">
                  <circle cx="25" cy="25" r="8" fill="currentColor" />
                  <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
