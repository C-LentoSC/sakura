'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
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
      priceKey: 'exclusiveServices.japaneseHeadSpa.price',
    },
    {
      id: 'dry-head-spa',
      image: '/services-images/head-spa.jpg',
      duration: '60',
      titleKey: 'exclusiveServices.dryHeadSpa.title',
      descKey: 'exclusiveServices.dryHeadSpa.description',
      priceKey: 'exclusiveServices.dryHeadSpa.price',
    },
    {
      id: 'imperial-retreat',
      image: '/services-images/beauty-nails.jpg',
      duration: '120',
      titleKey: 'exclusiveServices.imperialRetreat.title',
      descKey: 'exclusiveServices.imperialRetreat.description',
      priceKey: 'exclusiveServices.imperialRetreat.price',
    },
  ];

  const beautyServices = [
    {
      id: 'nail-art',
      image: '/services-images/nails.jpg',
      duration: '60',
      titleKey: 'exclusiveServices.nailArt.title',
      descKey: 'exclusiveServices.nailArt.description',
      priceKey: 'exclusiveServices.nailArt.price',
    },
    {
      id: 'lash-extension',
      image: '/services-images/beauty-nails.jpg',
      duration: '90',
      titleKey: 'exclusiveServices.lashExtension.title',
      descKey: 'exclusiveServices.lashExtension.description',
      priceKey: 'exclusiveServices.lashExtension.price',
    },
    {
      id: 'brow-styling',
      image: '/services-images/nails.jpg',
      duration: '45',
      titleKey: 'exclusiveServices.browStyling.title',
      descKey: 'exclusiveServices.browStyling.description',
      priceKey: 'exclusiveServices.browStyling.price',
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
              className="exclusive-service-card bg-white rounded-xl sm:rounded-2xl overflow-hidden flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Service Image */}
              <div className="relative w-full lg:w-40 xl:w-48 h-48 sm:h-56 md:h-64 lg:h-auto flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden">
                <Image
                  src={service.image}
                  alt={t(service.titleKey)}
                  fill
                  className="object-cover"
                />
                {/* Duration Badge */}
                <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                  <span className="text-xs sm:text-sm font-medium text-secondary">
                    {service.duration} {t('exclusiveServices.minutes')}
                  </span>
                </div>
              </div>

              {/* Service Content */}
              <div className="flex-1 flex flex-col justify-between min-h-0">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-sakura text-secondary mb-2 sm:mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-secondary/70 text-xs sm:text-sm md:text-base leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                    {t(service.descKey)}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mt-auto pt-2 sm:pt-3 md:pt-4">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-secondary order-2 sm:order-1">
                    {t(service.priceKey)}
                  </div>
                  <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto order-1 sm:order-2">
                    <Link
                      href="/booking"
                      className="flex-1 xs:flex-none text-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white text-xs sm:text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      {t('exclusiveServices.bookNow')}
                    </Link>
                    <Link
                      href={`/services/${service.id}`}
                      className="flex-1 xs:flex-none text-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-secondary/10 text-secondary text-xs sm:text-sm font-medium rounded-full hover:bg-secondary/20 transition-all duration-300"
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
