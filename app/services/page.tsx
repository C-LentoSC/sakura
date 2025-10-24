'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useServices, type Service } from '../hooks/useServices';
import { useCategories, type Category, type SubCategory, type SubSubCategory } from '../hooks/useCategories';
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
  const { t, language } = useLanguage();
  const [selectedMainCategory, setSelectedMainCategory] = useState('head-spa');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Fetch categories with SWR caching
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Fetch services with SWR caching
  const { services, isLoading: servicesLoading, error: servicesError } = useServices({
    category: selectedMainCategory,
    subCategory: selectedSubCategory !== 'all' ? selectedSubCategory : undefined,
    subSubCategory: selectedSubSubCategory !== 'all' ? selectedSubSubCategory : undefined,
  });

  // Set first category as default when categories load
  useEffect(() => {
    if (categories.length > 0 && selectedMainCategory === 'head-spa') {
      setSelectedMainCategory(categories[0].slug);
    }
  }, [categories, selectedMainCategory]);

  // Handle errors
  if (servicesError) {
    console.error('Error loading services:', servicesError);
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );
      }

      const cards = gsap.utils.toArray<HTMLElement>('.service-card');
      if (cards.length && servicesRef.current) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [services]);

  const getDisplayText = (key: string, translate: (k: string) => string) => {
    const translated = translate(key);
    if (translated && translated !== key) return translated;
    const pretty = (key || '').split('.').pop() || '';
    return pretty.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const renderName = (r: { nameKey: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? r.nameJa || r.nameEn : r.nameEn || r.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(r.nameKey, t);
  };

  const getServiceName = (s: Service) => {
    const val = language === 'ja' ? s.nameJa || s.nameEn : s.nameEn || s.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.nameKey, t);
  };

  const getServiceDesc = (s: Service) => {
    const val = language === 'ja' ? s.descJa || s.descEn : s.descEn || s.descJa;
    if (val && String(val).trim().length > 0) return String(val);
    return getDisplayText(s.descKey, t);
  };

  // Filter services by search query (client-side)
  const filteredServices = services.filter((service) => {
    if (searchQuery === '') return true;
    const q = searchQuery.toLowerCase();
    return (
      getServiceName(service).toLowerCase().includes(q) ||
      getServiceDesc(service).toLowerCase().includes(q)
    );
  });

  // Get current category and its sub-categories
  const currentCategory = categories.find(cat => cat.slug === selectedMainCategory);
  const currentSubCategories = [
    { id: 'all', slug: 'all', nameKey: 'services.subCategories.all', nameEn: 'All', nameJa: 'すべて', subSubCategories: [] as SubSubCategory[] },
    ...(currentCategory?.subCategories || [])
  ];

  // Get current sub-category and its sub-sub-categories
  const currentSubCategory = currentSubCategories.find(sub => sub.slug === selectedSubCategory);
  const currentSubSubCategories = selectedSubCategory !== 'all' && currentSubCategory?.subSubCategories ? [
    { id: 'all', slug: 'all', nameKey: 'services.subCategories.all', nameEn: 'All', nameJa: 'すべて' } as SubSubCategory,
    ...currentSubCategory.subSubCategories
  ] : [];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="flex-1 relative z-10 pt-20 sm:pt-24">
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
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedMainCategory(category.slug);
                  setSelectedSubCategory('all');
                  setSelectedSubSubCategory('all');
                }}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 text-sm ${
                  selectedMainCategory === category.slug
                    ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                    : 'bg-white/90 backdrop-blur-sm text-secondary/70 hover:text-secondary hover:bg-white hover:shadow-sm'
                }`}
              >
                {renderName(category)}
              </button>
            ))}
          </div>

          {/* Sub Category Filters (Level 2) */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {currentSubCategories.map((subCategory) => (
              <button
                key={subCategory.slug}
                onClick={() => {
                  setSelectedSubCategory(subCategory.slug);
                  setSelectedSubSubCategory('all');
                }}
                className={`px-4 py-1.5 rounded-full font-medium transition-all duration-300 text-xs ${
                  selectedSubCategory === subCategory.slug
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-white/70 backdrop-blur-sm text-secondary/60 hover:text-secondary hover:bg-white hover:shadow-sm'
                }`}
              >
                {renderName(subCategory)}
              </button>
            ))}
          </div>

          {/* Sub-Sub Category Filters (Level 3) */}
          {currentSubSubCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {currentSubSubCategories.map((subSubCategory) => (
                <button
                  key={subSubCategory.slug}
                  onClick={() => setSelectedSubSubCategory(subSubCategory.slug)}
                  className={`px-3 py-1 rounded-full font-medium transition-all duration-300 text-xs ${
                    selectedSubSubCategory === subSubCategory.slug
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white/60 backdrop-blur-sm text-secondary/50 hover:text-secondary hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {renderName(subSubCategory)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div ref={servicesRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-12 sm:pb-16">
          {servicesLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md border border-primary/10 animate-pulse">
                  <div className="flex flex-col sm:flex-row">
                    {/* Image skeleton */}
                    <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 bg-secondary/10" />
                    {/* Content skeleton */}
                    <div className="flex-1 p-4 space-y-3">
                      <div className="h-5 bg-secondary/10 rounded w-2/3" />
                      <div className="h-3 bg-secondary/10 rounded w-full" />
                      <div className="h-3 bg-secondary/10 rounded w-5/6" />
                      <div className="h-8 bg-secondary/10 rounded w-24 mt-2" />
                      <div className="flex gap-2 pt-1">
                        <div className="h-8 bg-secondary/10 rounded w-32" />
                        <div className="h-8 bg-secondary/10 rounded w-28" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  className="service-card bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-primary/10 hover:border-primary/20 group"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image Section */}
                    <Link href={`/services/${service.id}`} className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={getServiceName(service)}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 176px"
                        priority={index === 0}
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
                    </Link>

                    {/* Content Section */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <Link href={`/services/${service.id}`}>
                          <h3 className="text-lg font-sakura text-secondary mb-2 hover:text-primary transition-colors cursor-pointer">
                            {getServiceName(service)}
                          </h3>
                        </Link>
                        <p className="text-secondary/70 text-xs leading-relaxed mb-3 line-clamp-2">
                          {getServiceDesc(service)}
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(service.price)}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/services/${service.id}`}
                            className="w-full px-4 py-2 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-full hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 text-xs text-center"
                          >
                            View Details →
                          </Link>
                          <Link
                            href={`/book?service=${service.id}`}
                            className="w-full px-4 py-1.5 bg-white border border-primary/30 text-primary font-medium rounded-full hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 text-xs text-center"
                          >
                            {t('services.bookNow')}
                          </Link>
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
