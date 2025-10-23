'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [googleReviews, setGoogleReviews] = useState<Array<{ id: string; name: string; rating: number; text: string }>>([]);

  const testimonials = [
    {
      id: 1,
      nameKey: 'testimonials.client1.name',
      roleKey: 'testimonials.client1.role',
      image: '/testimonials/client1.jpg',
      rating: 5,
      textKey: 'testimonials.client1.text',
    },
    {
      id: 2,
      nameKey: 'testimonials.client2.name',
      roleKey: 'testimonials.client2.role',
      image: '/testimonials/client2.jpg',
      rating: 5,
      textKey: 'testimonials.client2.text',
    },
    {
      id: 3,
      nameKey: 'testimonials.client3.name',
      roleKey: 'testimonials.client3.role',
      image: '/testimonials/client3.jpg',
      rating: 5,
      textKey: 'testimonials.client3.text',
    },
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

      // Cards stagger animation
      gsap.fromTo(".testimonial-card", 
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/reviews/google?limit=3', { headers: { 'accept': 'application/json' } });
        if (!res.ok) return;
        type ReviewItem = { id: string; name: string; rating: number; text: string };
        type ApiResponse = { reviews: ReviewItem[] };
        const data: ApiResponse = await res.json();
        if (!cancelled && Array.isArray(data.reviews)) {
          const mapped: ReviewItem[] = data.reviews.map((r: ReviewItem) => ({
            id: r.id,
            name: r.name,
            rating: r.rating,
            text: r.text,
          }));
          setGoogleReviews(mapped);
        }
      } catch {
        // ignore network errors
      }
    })();
    return () => {
      cancelled = true;
    };
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
        <div ref={titleRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sakura text-secondary mb-3 sm:mb-4">
            {t('testimonials.mainTitle')}
          </h2>
          <p className="text-secondary/70 text-sm sm:text-base max-w-2xl mx-auto">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-secondary/5 hover:border-primary/20 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-pink-200/40 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-sakura text-primary">
                      {t(testimonial.nameKey).charAt(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary">
                    {t(testimonial.nameKey)}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary/60">
                    {t(testimonial.roleKey)}
                  </p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-secondary/80 text-sm sm:text-base leading-relaxed">
                &ldquo;{t(testimonial.textKey)}&rdquo;
              </p>

              {/* Decorative Element */}
              <div className="absolute bottom-4 right-4 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
                  <circle cx="50" cy="50" r="15" fill="currentColor" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>
            </div>
          ))}

          {googleReviews.map((r) => (
            <div
              key={r.id}
              className="testimonial-card group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-500 border border-secondary/5 hover:border-primary/20 hover:-translate-y-2"
            >
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                </svg>
              </div>

              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-pink-200/40 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-sakura text-primary">{r.name.charAt(0)}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-secondary">{r.name}</h3>
                  <p className="text-xs sm:text-sm text-secondary/60">{t('testimonials.google.role')}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(Math.max(0, Math.min(5, Math.round(r.rating))))].map((_, i) => (
                  <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>

              <p className="text-secondary/80 text-sm sm:text-base leading-relaxed">&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="flex justify-center items-center gap-2 mt-12 sm:mt-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index
                  ? 'bg-primary w-8'
                  : 'bg-secondary/20 hover:bg-secondary/40'
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
