'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
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

export default function AboutPage() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );

      // Story section animation
      gsap.fromTo(storyRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Values animation
      gsap.fromTo(".value-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Team animation
      gsap.fromTo(".team-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const values = [
    {
      id: 1,
      titleKey: 'about.values.excellence.title',
      descKey: 'about.values.excellence.description',
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      titleKey: 'about.values.authenticity.title',
      descKey: 'about.values.authenticity.description',
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      id: 3,
      titleKey: 'about.values.wellness.title',
      descKey: 'about.values.wellness.description',
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      titleKey: 'about.values.innovation.title',
      descKey: 'about.values.innovation.description',
      icon: (
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  const team = [
    {
      id: 1,
      nameKey: 'about.team.member1.name',
      roleKey: 'about.team.member1.role',
      descKey: 'about.team.member1.description',
      image: '/aboutus/team/1.jpg',
    },
    {
      id: 2,
      nameKey: 'about.team.member2.name',
      roleKey: 'about.team.member2.role',
      descKey: 'about.team.member2.description',
      image: '/aboutus/team/2.jpg',
    },
    {
      id: 3,
      nameKey: 'about.team.member3.name',
      roleKey: 'about.team.member3.role',
      descKey: 'about.team.member3.description',
      image: '/aboutus/team/3.jpg',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-200/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-24 sm:pt-28 md:pt-32">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sakura text-secondary mb-4 sm:mb-6">
              {t('about.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-secondary/70 leading-relaxed">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div ref={storyRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/aboutus/openday.jpg"
                alt="Sakura Saloon Interior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent"></div>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-sakura text-secondary mb-6">
                {t('about.story.title')}
              </h2>
              <div className="space-y-4 text-secondary/80 leading-relaxed">
                <p>{t('about.story.paragraph1')}</p>
                <p>{t('about.story.paragraph2')}</p>
                <p>{t('about.story.paragraph3')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div ref={valuesRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sakura text-secondary mb-4">
              {t('about.values.title')}
            </h2>
            <p className="text-secondary/70 text-lg max-w-2xl mx-auto">
              {t('about.values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value) => (
              <div
                key={value.id}
                className="value-card bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">
                  {t(value.titleKey)}
                </h3>
                <p className="text-secondary/70 text-sm leading-relaxed">
                  {t(value.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Team Section */}
        <div ref={teamRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sakura text-secondary mb-4">
              {t('about.team.title')}
            </h2>
            <p className="text-secondary/70 text-lg max-w-2xl mx-auto">
              {t('about.team.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="team-card bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-primary/10 hover:border-primary/30 group"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={t(member.nameKey)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white mb-1 drop-shadow-lg">
                      {t(member.nameKey)}
                    </h3>
                    <p className="text-white text-sm drop-shadow-md">
                      {t(member.roleKey)}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-secondary/70 text-sm leading-relaxed">
                    {t(member.descKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="bg-gradient-to-br from-primary/10 to-pink-100/50 rounded-3xl p-8 sm:p-12 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sakura text-secondary mb-4 sm:mb-6">
              {t('about.cta.title')}
            </h2>
            <p className="text-secondary/70 text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              {t('about.cta.description')}
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
              {t('about.cta.button')}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
