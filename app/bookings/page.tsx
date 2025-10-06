'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
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

interface bookings {
  id: number;
  service: string;
  image: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function MybookingsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  
  const heroRef = useRef<HTMLDivElement>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      // bookings animation
      gsap.fromTo(bookingsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, [activeTab]);

  // Mock bookings data - in real app this would come from API/database
  const mockbookings: bookings[] = [
    {
      id: 1,
      service: 'Imperial Retreat',
      image: '/services-images/beauty-nails.jpg',
      date: '2025-01-15',
      time: '2:00 PM',
      duration: '120 min',
      price: 160,
      status: 'upcoming',
      createdAt: '2025-01-05'
    },
    {
      id: 2,
      service: 'Zen Head Spa',
      image: '/services-images/head-spa.jpg',
      date: '2025-01-20',
      time: '10:30 AM',
      duration: '75 min',
      price: 95,
      status: 'upcoming',
      createdAt: '2025-01-06'
    },
    {
      id: 3,
      service: 'Classic Lashes',
      image: '/services-images/beauty-nails.jpg',
      date: '2024-12-28',
      time: '3:00 PM',
      duration: '120 min',
      price: 150,
      status: 'completed',
      createdAt: '2024-12-20'
    },
    {
      id: 4,
      service: 'Gel Manicure',
      image: '/services-images/nails.jpg',
      date: '2024-12-15',
      time: '11:00 AM',
      duration: '60 min',
      price: 65,
      status: 'completed',
      createdAt: '2024-12-10'
    },
    {
      id: 5,
      service: 'Crystal Scalp Massage',
      image: '/services-images/head-spa2.jpg',
      date: '2024-12-05',
      time: '4:30 PM',
      duration: '85 min',
      price: 135,
      status: 'cancelled',
      createdAt: '2024-11-28'
    }
  ];

  const filteredbookings = mockbookings.filter(bookings => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return bookings.status === 'upcoming';
    if (activeTab === 'completed') return bookings.status === 'completed';
    return false;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return t('bookings.status.upcoming');
      case 'completed': return t('bookings.status.completed');
      case 'cancelled': return t('bookings.status.cancelled');
      default: return status;
    }
  };

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
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-sakura text-secondary mb-4">
              {t('bookings.hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed">
              {t('bookings.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* bookings Section */}
        <div ref={bookingsRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pb-16 sm:pb-20">
          {/* Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 shadow-md border border-primary/10 w-full sm:w-auto">
              <div className="flex space-x-1 sm:space-x-2">
                {(['upcoming', 'completed', 'all'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                        : 'text-secondary/70 hover:text-secondary hover:bg-primary/5'
                    }`}
                  >
                    {t(`bookings.tabs.${tab}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* bookings List */}
          <div className="space-y-4">
            {filteredbookings.length > 0 ? (
              filteredbookings.map((bookings) => (
                <div
                  key={bookings.id}
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-primary/10 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Service Image */}
                    <div className="lg:w-1/3 relative h-48 sm:h-56 lg:h-auto lg:min-h-[200px]">
                      <Image
                        src={bookings.image}
                        alt={bookings.service}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStatusColor(bookings.status)}`}>
                          {getStatusText(bookings.status)}
                        </span>
                      </div>
                    </div>

                    {/* Left Side - Service Info */}
                    <div className="lg:w-1/3 bg-gradient-to-br from-primary/10 via-pink-50/50 to-amber-50/30 p-4 sm:p-6 flex flex-col justify-between min-h-[140px] sm:min-h-[160px]">
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-sakura text-secondary leading-tight mb-2 sm:mb-3">
                          {bookings.service}
                        </h3>
                        <div className="flex items-center gap-2 text-secondary/60 text-xs sm:text-sm mb-3 sm:mb-4">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{bookings.duration}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-4">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                          {formatCurrency(bookings.price)}
                        </div>
                        <div className="text-xs text-secondary/50">
                          Booked on {bookings.createdAt}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Details and Actions */}
                    <div className="lg:w-1/3 p-4 sm:p-6 flex flex-col justify-between">
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-secondary/60 mb-1">{t('bookings.details.date')}</div>
                            <div className="font-semibold text-secondary text-sm sm:text-base truncate">
                              {bookings.date}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs text-secondary/60 mb-1">{t('bookings.details.time')}</div>
                            <div className="font-semibold text-secondary text-sm sm:text-base">{bookings.time}</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {bookings.status === 'upcoming' && (
                          <>
                            <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap">
                              {t('bookings.actions.reschedule')}
                            </button>
                            <button className="sm:flex-shrink-0 px-4 py-2.5 bg-white border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-sm whitespace-nowrap">
                              {t('bookings.actions.cancel')}
                            </button>
                          </>
                        )}
                        {bookings.status === 'completed' && (
                          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap">
                            {t('bookings.actions.bookAgain')}
                          </button>
                        )}
                        {bookings.status === 'cancelled' && (
                          <button className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap">
                            {t('bookings.actions.bookAgain')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{t('bookings.empty.title')}</h3>
                <p className="text-secondary/70 mb-6">{t('bookings.empty.message')}</p>
                <Link
                  href="/book"
                  className="inline-flex px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  {t('bookings.empty.action')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
