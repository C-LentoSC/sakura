'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ExclusiveServices() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'headSpa' | 'beauty'>('headSpa');
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const headSpaServices = [
    {
      id: 'japanese-head-spa',
      image: '/services-images/head-spa2.jpg',
      duration: '90',
      titleKey: 'exclusiveServices.japaneseHeadSpa.title',
      descKey: 'exclusiveServices.japaneseHeadSpa.description',
      price: 969,
    },
    {
      id: 'dry-head-spa',
      image: '/services-images/head-spa.jpg',
      duration: '60',
      titleKey: 'exclusiveServices.dryHeadSpa.title',
      descKey: 'exclusiveServices.dryHeadSpa.description',
      price: 599,
    },
    {
      id: 'imperial-retreat',
      image: '/services-images/beauty-nails.jpg',
      duration: '120',
      titleKey: 'exclusiveServices.imperialRetreat.title',
      descKey: 'exclusiveServices.imperialRetreat.description',
      price: 1299,
    },
  ];

  const beautyServices = [
    {
      id: 'nail-art',
      image: '/services-images/nails.jpg',
      duration: '60',
      titleKey: 'exclusiveServices.nailArt.title',
      descKey: 'exclusiveServices.nailArt.description',
      price: 799,
    },
    {
      id: 'lash-extension',
      image: '/services-images/beauty-nails.jpg',
      duration: '90',
      titleKey: 'exclusiveServices.lashExtension.title',
      descKey: 'exclusiveServices.lashExtension.description',
      price: 1199,
    },
    {
      id: 'brow-styling',
      image: '/services-images/nails.jpg',
      duration: '45',
      titleKey: 'exclusiveServices.browStyling.title',
      descKey: 'exclusiveServices.browStyling.description',
      price: 599,
    },
  ];

  const currentServices = activeTab === 'headSpa' ? headSpaServices : beautyServices;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Tabs animation
      gsap.fromTo(tabsRef.current, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Service cards stagger animation
      gsap.fromTo(".exclusive-service-card", 
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 relative overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, rgba(251, 207, 232, 0.3) 0%, rgba(252, 231, 243, 0.2) 40%, rgba(255, 255, 255, 0) 80%)'
    }}>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-sakura text-secondary mb-3 sm:mb-4 md:mb-6 px-2">
            {t('exclusiveServices.mainTitle')}
          </h2>
        </div>

        {/* Category Tabs */}
        <div ref={tabsRef} className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12 px-2">
          <button 
            onClick={() => setActiveTab('headSpa')}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
              activeTab === 'headSpa' 
                ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-lg' 
                : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
            }`}
          >
            {t('exclusiveServices.tabs.headSpa')}
          </button>
          <button 
            onClick={() => setActiveTab('beauty')}
            className={`w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-md transition-all duration-300 ${
              activeTab === 'beauty' 
                ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-lg' 
                : 'bg-secondary/10 text-secondary hover:bg-secondary/20'
            }`}
          >
            {t('exclusiveServices.tabs.beauty')}
          </button>
        </div>

        {/* Services Container */}
        <div ref={cardsRef} className="space-y-4 sm:space-y-6 md:space-y-8">
          {currentServices.map((service) => (
            <div
              key={service.id}
              className="exclusive-service-card group/card bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6 shadow-md hover:shadow-2xl border border-secondary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Service Image */}
              <div className="relative w-full lg:w-44 xl:w-52 h-52 sm:h-60 md:h-64 lg:h-auto flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-md group-hover/card:shadow-xl transition-shadow duration-500">
                <Image
                  src={service.image}
                  alt={t(service.titleKey)}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-700"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                
                {/* Duration Badge */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-primary/95 to-pink-400/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {service.duration} {t('exclusiveServices.minutes')}
                    </span>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute bottom-3 right-3 w-8 h-8 opacity-20 group-hover/card:opacity-40 transition-opacity duration-500">
                  <svg viewBox="0 0 50 50" className="w-full h-full text-primary">
                    <circle cx="25" cy="25" r="8" fill="currentColor" />
                    <circle cx="25" cy="25" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>

              {/* Service Content */}
              <div className="flex-1 flex flex-col justify-between min-h-0">
                <div className="flex-1">
                  {/* Title with decorative line */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sakura text-secondary group-hover/card:text-primary transition-colors duration-300 leading-tight mb-2">
                      {t(service.titleKey)}
                    </h3>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-pink-400 rounded-full"></div>
                  </div>
                  
                  <p className="text-secondary/70 group-hover/card:text-secondary/80 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none transition-colors duration-300">
                    {t(service.descKey)}
                  </p>
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-5 mt-auto pt-3 sm:pt-4 md:pt-5 border-t border-secondary/5">
                  {/* Price Badge */}
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                        {formatCurrency(service.price)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <Link
                      href="/booking"
                      className="group/btn flex-1 xs:flex-none text-center px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-pink-400 text-white text-xs sm:text-sm font-semibold rounded-full hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t('exclusiveServices.bookNow')}
                        <svg className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    </Link>
                    <Link
                      href={`/services/${service.id}`}
                      className="flex-1 xs:flex-none text-center px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 bg-secondary/5 hover:bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full border border-secondary/10 hover:border-secondary/20 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {t('exclusiveServices.sameInfo')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* See More Button */}
          <div className="text-center pt-4 sm:pt-6 md:pt-8">
            <Link
              href="/services"
              className="inline-block w-full sm:w-auto px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-primary to-pink-400 text-white text-sm sm:text-base font-medium rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {t('exclusiveServices.seeMore')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
