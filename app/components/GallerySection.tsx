'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const galleryItems = [
    { src: '/gallery/1.jpg', width: 800, height: 1000, featured: true },
    { src: '/gallery/3.jpg', width: 800, height: 900, featured: false },
    { src: '/gallery/6.jpg', width: 800, height: 1100, featured: true },
    { src: '/gallery/8.jpg', width: 800, height: 950, featured: false },
    { src: '/gallery/11.jpg', width: 800, height: 850, featured: false },
    { src: '/gallery/13.jpg', width: 800, height: 900, featured: true },
    { src: '/gallery/14.jpg', width: 800, height: 700, featured: false },
    { src: '/gallery/15.jpg', width: 800, height: 800, featured: false },
    { src: '/gallery/2.jpg', width: 800, height: 600, featured: false },
  ];

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

      // Gallery items stagger animation
      gsap.fromTo(".gallery-item", 
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-24 lg:py-28 relative overflow-hidden">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-amber-50/40 backdrop-blur-sm"></div>
      <div 
        className="absolute inset-0 backdrop-blur-xs" 
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 207, 232, 0.2) 0%, rgba(252, 231, 243, 0.15) 40%, rgba(255, 255, 255, 0) 80%)'
        }}
      ></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sakura text-secondary mb-2 sm:mb-3">
            {t('gallery.mainTitle')}
          </h2>
          <p className="text-secondary/70 text-sm sm:text-base max-w-xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        {/* Gallery Grid - Perfect Fill Layout */}
        <div ref={gridRef} className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-0.5 sm:gap-1 auto-rows-[100px] sm:auto-rows-[120px] md:auto-rows-[140px]">
          
          {/* Large hero - Head spa treatment (left) */}
          <div className="gallery-item group relative col-span-3 sm:col-span-4 md:col-span-5 row-span-4 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[0].src} alt="Head Spa Treatment" fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Medium - Spa room (top right) */}
          <div className="gallery-item group relative col-span-2 sm:col-span-2 md:col-span-2 row-span-2 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[1].src} alt="Spa Room" fill sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Tall - Lash application (far right) */}
          <div className="gallery-item group relative col-span-1 sm:col-span-2 md:col-span-3 row-span-5 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[2].src} alt="Lash Application" fill sizes="(max-width: 640px) 17vw, (max-width: 768px) 25vw, 30vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Small products (under spa room) */}
          <div className="gallery-item group relative col-span-2 sm:col-span-2 md:col-span-2 row-span-1 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[3].src} alt="Products" fill sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Small flowers (bottom left of hero) */}
          <div className="gallery-item group relative col-span-1 sm:col-span-1 md:col-span-1 row-span-1 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[4].src} alt="Flowers" fill sizes="(max-width: 640px) 17vw, (max-width: 768px) 12vw, 10vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Small products 2 */}
          <div className="gallery-item group relative col-span-1 sm:col-span-1 md:col-span-1 row-span-1 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[5].src} alt="Small Products" fill sizes="(max-width: 640px) 17vw, (max-width: 768px) 12vw, 10vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Small products 3 (fill remaining) */}
          <div className="gallery-item group relative col-span-1 sm:col-span-1 md:col-span-1 row-span-1 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[6].src} alt="More Products" fill sizes="(max-width: 640px) 17vw, (max-width: 768px) 12vw, 10vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Wide products with towels (bottom) */}
          <div className="gallery-item group relative col-span-3 sm:col-span-4 md:col-span-4 row-span-2 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[7].src} alt="Products with Towels" fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, 40vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Medium bottles (bottom center) */}
          <div className="gallery-item group relative col-span-2 sm:col-span-2 md:col-span-2 row-span-2 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[8].src} alt="Product Bottles" fill sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          {/* Small spa room (bottom right corner) */}
          <div className="gallery-item group relative col-span-1 sm:col-span-2 md:col-span-1 row-span-1 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Image src={galleryItems[1].src} alt="Spa Room Detail" fill sizes="(max-width: 640px) 17vw, (max-width: 768px) 25vw, 10vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

        </div>
      </div>
    </section>
  );
}
