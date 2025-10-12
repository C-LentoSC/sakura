'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';
import { loadBookings, updateBookingStatus, type BookingData } from '@/app/utils/bookingStorage';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chatbot } from '@/app/components';

gsap.registerPlugin(ScrollTrigger);

// Use the BookingData interface from utils
type bookings = BookingData;

export default function MybookingsPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'booked' | 'pending' | 'canceled' | 'all'>('booked');
  const [bookings, setBookings] = useState<bookings[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error'; message: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const heroRef = useRef<HTMLDivElement>(null);
  const bookingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation - only run once on mount
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }
      );

      // bookings animation - only run once on mount
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
  }, []); // Remove activeTab dependency to prevent re-animation

  // Helper types for service enrichment
  interface ServiceLite { id: string; nameKey: string; nameEn?: string | null; nameJa?: string | null; price: number; duration: string; image: string }
  const renderName = useCallback((r: { nameKey: string; nameEn?: string | null; nameJa?: string | null }) => {
    const val = language === 'ja' ? r.nameJa || r.nameEn : r.nameEn || r.nameJa;
    if (val && String(val).trim().length > 0) return String(val);
    const translated = t(r.nameKey);
    if (translated && translated !== r.nameKey) return translated;
    const key = (r.nameKey || '').split('.').pop() || '';
    return key.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }, [language, t]);

  // Initialize bookings data (merge server + local for resilience)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Read local first
        let local = loadBookings();

        // Fetch server bookings for logged-in user
        const res = await fetch('/api/my-bookings', { cache: 'no-store' });
        let merged = local;
        if (res.ok) {
          const data = await res.json();
          const server = Array.isArray(data.bookings) ? data.bookings : [];

          // Try to enrich with service details in one call
          let services: ServiceLite[] = [];
          try {
            const sres = await fetch('/api/services');
            if (sres.ok) {
              const sdata = await sres.json();
              services = Array.isArray(sdata.services) ? sdata.services : [];
            }
          } catch {}

          const serverAsLocal = server.map((b: { serviceId: string; date: string; time: string; status?: string; createdAt?: string }) => {
            const svc = services.find((s) => s.id === b.serviceId);
            return {
              id: Number.MAX_SAFE_INTEGER - Math.floor(Math.random() * 1e6), // prevent collision with local ids
              service: svc ? renderName(svc) : 'Service',
              image: svc?.image || '/packages/1.jpg',
              date: b.date,
              time: b.time,
              duration: svc?.duration || '60 min',
              price: svc?.price ?? 0,
              status: (b.status || 'CONFIRMED').toUpperCase(),
              createdAt: new Date(b.createdAt || Date.now()).toISOString().split('T')[0],
            } as bookings;
          });

          // Re-localize local-only bookings by best name match
          if (services.length > 0 && local.length > 0) {
            local = local.map((lb) => {
              const match = services.find((s) => {
                const candidates = [s.nameEn, s.nameJa, t(s.nameKey)].filter(Boolean).map((x) => String(x).trim().toLowerCase());
                return candidates.includes(lb.service.trim().toLowerCase());
              });
              if (match) {
                return { ...lb, service: renderName(match) };
              }
              return lb;
            });
          }

          // Merge by (date+time) uniqueness to avoid duplicates
          const key = (x: bookings) => `${x.date}|${x.time}|${x.service}`;
          const map = new Map<string, bookings>();
          [...serverAsLocal, ...local].forEach((b) => map.set(key(b), b));
          merged = Array.from(map.values());
        }

        if (!cancelled) setBookings(merged);
      } catch (err) {
        console.error('Failed to load bookings:', err);
        if (!cancelled) setError('Failed to load bookings. Please refresh the page.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [renderName, t]);

  // Booking management functions
  const handleCancelBooking = async (bookingId: number) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update booking status using utility
      updateBookingStatus(bookingId, 'CANCELLED');
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' as const }
          : booking
      );
      setBookings(updatedBookings);
      setShowCancelModal(null);
      // Show success notification
      setNotification({
        type: 'success',
        message: t('bookings.messages.cancelSuccess')
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch {
      setNotification({
        type: 'error',
        message: t('bookings.messages.cancelError')
      });
      
      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAgain = (bookingId: number) => {
    // In a real app, this would navigate to booking page with service pre-selected
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      // Navigate to booking page with same service
      window.location.href = `/book?service=${booking.id}`;
    }
  };

  const filteredbookings = bookings.filter((booking: bookings) => {
    if (activeTab === 'all') return true;
    // Normalize to lowercase for comparison
    const s = String(booking.status).toLowerCase();
    if (activeTab === 'booked') return s === 'booked' || s === 'confirmed';
    if (activeTab === 'pending') return s === 'pending' || s === 'no-show';
    if (activeTab === 'canceled') return s === 'canceled' || s === 'cancelled';
    return true;
  });

  const getStatusColor = (status: string) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'booked':
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'canceled':
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
      case 'no-show':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'booked':
      case 'confirmed':
        return language === 'ja' ? '予約済み' : 'BOOKED';
      case 'pending':
      case 'no-show':
        return language === 'ja' ? '保留中' : 'PENDING';
      case 'canceled':
      case 'cancelled':
        return language === 'ja' ? 'キャンセル済み' : 'CANCELED';
      case 'completed':
        return t('bookings.status.completed');
      default:
        return s.toUpperCase();
    }
  };

  return (
    <div className="relative">
      <Chatbot />

      {/* Hero Section */}
      <div className="relative z-10 pt-2">
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
      </div>

      {/* bookings Section */}
      <div ref={bookingsRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pb-16 sm:pb-20">
          {/* Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-1.5 sm:p-2 shadow-md border border-primary/10 w-full sm:w-auto">
              <div className="flex space-x-1 sm:space-x-2">
                {([
                  { key: 'booked', label: language === 'ja' ? '予約済み' : 'Booked' },
                  { key: 'pending', label: language === 'ja' ? '保留中' : 'Pending' },
                  { key: 'canceled', label: language === 'ja' ? 'キャンセル済み' : 'Cancelled' },
                  { key: 'all', label: t('bookings.tabs.all') },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'booked' | 'pending' | 'canceled' | 'all')}
                    className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                        : 'text-secondary/70 hover:text-secondary hover:bg-primary/5'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-red-800">Error</span>
              </div>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          )}

          {/* bookings List */}
          <div className="space-y-4">
            {!error && filteredbookings.length > 0 ? (
              filteredbookings.map((bookings, index) => (
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
                        priority={index === 0}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-white/60 shadow-sm backdrop-blur-sm ${getStatusColor(bookings.status)}`}>
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
                        {bookings.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => setShowCancelModal(bookings.id)}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-white border-2 border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 hover:border-red-300 transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {t('bookings.actions.cancel')}
                          </button>
                        )}
                        {bookings.status === 'COMPLETED' && (
                          <button 
                            onClick={() => handleBookAgain(bookings.id)}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
                            {t('bookings.actions.bookAgain')}
                          </button>
                        )}
                        {(bookings.status === 'CANCELLED' || bookings.status === 'NO-SHOW') && (
                          <button 
                            onClick={() => handleBookAgain(bookings.id)}
                            disabled={isLoading}
                            className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                          >
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-2">
                {t('bookings.cancel.title')}
              </h3>
              <p className="text-secondary/70 mb-6">
                {t('bookings.cancel.message')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-secondary font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                >
                  {t('bookings.cancel.keep')}
                </button>
                <button
                  onClick={() => showCancelModal && handleCancelBooking(showCancelModal)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cancelling...' : t('bookings.cancel.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Minimal Notification Toast */}
      {notification && (
        <div className="fixed top-8 sm:top-12 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-auto z-50 transition-all duration-500 ease-out animate-in fade-in slide-in-from-top-2">
          <div className={`px-4 sm:px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 ${
            notification.type === 'success' 
              ? 'bg-white/95 text-secondary' 
              : 'bg-white/95 text-secondary'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                notification.type === 'success' ? 'bg-primary' : 'bg-red-400'
              }`}></div>
              <span className="text-xs sm:text-sm font-medium leading-tight">{notification.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
