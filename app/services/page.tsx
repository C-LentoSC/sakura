'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import {
  SERVICE_MAIN_CATEGORIES,
  SERVICE_SUB_CATEGORIES,
  SERVICES_DATA,
  type ServiceCategoryId,
} from '../constants/services';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '../components';

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const { t } = useLanguage();
  const [selectedMainCategory, setSelectedMainCategory] = useState('head-spa');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(".service-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, [selectedMainCategory, selectedSubCategory]);

  // Main Categories (Level 1)
  const mainCategories = SERVICE_MAIN_CATEGORIES;

  const filteredServices = SERVICES_DATA.filter(service => {
    const matchesMainCategory = service.mainCategory === selectedMainCategory;
    const matchesSubCategory = selectedSubCategory === 'all' || service.subCategory === selectedSubCategory;
    const matchesSearch = searchQuery === '' || 
      t(service.nameKey).toLowerCase().includes(searchQuery.toLowerCase()) ||
      t(service.descKey).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMainCategory && matchesSubCategory && matchesSearch;
  });

  const currentSubCategories = SERVICE_SUB_CATEGORIES[selectedMainCategory as ServiceCategoryId] ?? [];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 sm:py-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-7xl font-sakura text-secondary mb-3">
              {t('services.hero.title')}
            </h1>
            <p className="text-sm sm:text-base text-secondary/70 leading-relaxed mb-6">
              {t('services.hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('services.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-2.5 rounded-full border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm text-secondary placeholder:text-secondary/50 bg-white/80 backdrop-blur-sm"
                />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filters Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-8">
          {/* Main Category Tabs (Level 1) */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedMainCategory(category.id);
                  setSelectedSubCategory('all');
                }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                  selectedMainCategory === category.id
                    ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                    : 'bg-white/90 backdrop-blur-sm text-secondary/70 hover:text-secondary hover:bg-white hover:shadow-sm'
                }`}
              >
                {t(category.nameKey)}
              </button>
            ))}
          </div>

          {/* Sub Category Filters (Level 2) */}
          <div className="flex flex-wrap justify-center gap-2">
            {currentSubCategories.map((subCategory) => (
              <button
                key={subCategory.id}
                onClick={() => setSelectedSubCategory(subCategory.id)}
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-xs ${
                  selectedSubCategory === subCategory.id
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-white/70 backdrop-blur-sm text-secondary/60 hover:text-secondary hover:bg-white hover:shadow-sm'
                }`}
              >
                {t(subCategory.nameKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div ref={servicesRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-12 sm:pb-16">
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="service-card bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10 hover:border-primary/20"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={t(service.nameKey)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 176px"
                      />
                      {/* Duration Badge */}
                      <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                        <span className="text-white font-medium text-xs flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-sakura text-secondary mb-2">
                          {t(service.nameKey)}
                        </h3>
                        <p className="text-secondary/70 text-xs leading-relaxed mb-3 line-clamp-2">
                          {t(service.descKey)}
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(service.price)}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/book?service=${service.id}`}
                            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 text-xs text-center"
                          >
                            {t('services.bookNow')} →
                          </Link>
                          <button className="w-full px-4 py-1.5 bg-white border border-secondary/30 text-secondary font-medium rounded-full hover:bg-secondary/5 hover:border-secondary/50 transition-all duration-300 text-xs">
                            {t('services.contactInfo')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-secondary/60 text-base">{t('services.noResults')}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
