'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Header,
  Footer,
  Chatbot
} from '../components';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { SERVICES_DATA } from '../constants/services';

gsap.registerPlugin(ScrollTrigger);

interface BookingData {
  service: string;
  serviceId: number;
  date: string;
  time: string;
  duration: string;
  price: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

function BookPageContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('service');
  
  const [currentStep, setCurrentStep] = useState(2);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: '',
    serviceId: 0,
    date: '',
    time: '',
    duration: '',
    price: 0,
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const heroRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load service data from URL parameter
    if (preSelectedServiceId) {
      const service = SERVICES_DATA.find(s => s.id === parseInt(preSelectedServiceId));
      if (service) {
        setBookingData(prev => ({
          ...prev,
          service: t(service.nameKey),
          serviceId: service.id,
          duration: service.duration,
          price: service.price
        }));
      }
    }
  }, [preSelectedServiceId, t]);

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

      // Step animation
      gsap.fromTo(stepRef.current,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    });

    return () => ctx.revert();
  }, [currentStep]);

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM'
  ];


  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const resetBooking = () => {
    setBookingData({
      service: '',
      serviceId: 0,
      date: '',
      time: '',
      duration: '',
      price: 0,
      name: '',
      email: '',
      phone: '',
      notes: '',
    });
    setCurrentStep(2);
    setSubmitStatus('idle');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-6 sm:py-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sakura text-secondary mb-4">
              Complete Your Booking
            </h1>
            <p className="text-base sm:text-lg text-secondary/60 leading-relaxed max-w-2xl mx-auto">
              {t('book.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Booking Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Sidebar - Progress & Service Info */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                {/* Progress Steps */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                  <h3 className="font-semibold text-secondary mb-4 text-sm">Booking Progress</h3>
                  <div className="space-y-4">
                    {[
                      { step: 2, label: 'Date & Time', icon: 'calendar' },
                      { step: 3, label: 'Your Details', icon: 'user' },
                      { step: 4, label: 'Confirmation', icon: 'check' }
                    ].map((item, index) => (
                      <div key={item.step} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                          currentStep >= item.step 
                            ? 'bg-gradient-to-r from-primary to-pink-400 text-white' 
                            : currentStep === item.step - 1
                            ? 'bg-primary/20 text-primary border-2 border-primary/30'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {currentStep > item.step ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${
                            currentStep >= item.step ? 'text-secondary' : 'text-secondary/50'
                          }`}>
                            {item.label}
                          </div>
                        </div>
                        <div className="w-5 h-5 text-primary">
                          {item.icon === 'calendar' && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                          {item.icon === 'user' && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {item.icon === 'check' && (
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Service Card */}
                {bookingData.service && (
                  <div className="bg-gradient-to-br from-primary/10 via-pink-50/50 to-amber-50/30 rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sakura text-lg text-secondary mb-1">Selected Service</h3>
                        <p className="text-secondary/60 text-sm">Your chosen treatment</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <h4 className="font-semibold text-secondary mb-2">{bookingData.service}</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary/70">Duration: {bookingData.duration}</span>
                        <span className="font-bold text-primary text-lg">{formatCurrency(bookingData.price)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Booking Steps */}
            <div className="lg:col-span-8">
              <div ref={stepRef} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
                {/* Step 1: Date & Time Selection */}
                {currentStep === 2 && (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">When would you like to visit?</h2>
                          <p className="text-sm text-secondary/60">Choose your preferred date and time</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Date Selection */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-4">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Select Date
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base bg-white/80 backdrop-blur-sm"
                            onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-4">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Select Time
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setBookingData(prev => ({ ...prev, time }))}
                              className={`w-full h-12 text-sm font-medium rounded-xl border-2 transition-all duration-300 flex items-center justify-center ${
                                bookingData.time === time
                                  ? 'bg-gradient-to-r from-primary to-pink-400 text-white border-primary shadow-lg scale-105'
                                  : 'bg-white/80 border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-primary/10">
                      <button
                        onClick={() => bookingData.date && bookingData.time && setCurrentStep(3)}
                        disabled={!bookingData.date || !bookingData.time}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                      >
                        Continue to Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 3 && (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">Tell us about yourself</h2>
                          <p className="text-sm text-secondary/60">We need a few details to complete your booking</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your full name"
                            className="w-full px-4 py-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base bg-white/80 backdrop-blur-sm"
                            onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="your.email@example.com"
                            className="w-full px-4 py-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base bg-white/80 backdrop-blur-sm"
                            onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-base bg-white/80 backdrop-blur-sm"
                          onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Special Requests (Optional)
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Any special requests or notes for your appointment..."
                          className="w-full px-4 py-4 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none resize-none text-base bg-white/80 backdrop-blur-sm"
                          onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-primary/10">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-3 bg-white border-2 border-primary/20 text-secondary rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Date & Time
                      </button>
                      <button
                        onClick={() => bookingData.name && bookingData.email && setCurrentStep(4)}
                        disabled={!bookingData.name || !bookingData.email}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                      >
                        Review Booking
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 4 && (
                  <div className="p-6 sm:p-8">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">Review Your Booking</h2>
                          <p className="text-sm text-secondary/60">Please confirm your appointment details</p>
                        </div>
                      </div>
                    </div>

                    {submitStatus === 'success' ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-sakura text-secondary mb-3">{t('book.success.title')}</h3>
                        <p className="text-secondary/70 mb-8 max-w-md mx-auto">{t('book.success.message')}</p>
                        <button
                          onClick={resetBooking}
                          className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          {t('book.success.newBooking')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="bg-gradient-to-br from-primary/5 to-pink-50/50 rounded-2xl p-6 mb-8 border border-primary/10">
                          <h3 className="font-semibold text-secondary mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Booking Summary
                          </h3>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                  <div className="text-sm text-secondary/60">Service</div>
                                  <div className="font-semibold text-secondary">{bookingData.service}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                  <div className="text-sm text-secondary/60">Date</div>
                                  <div className="font-semibold text-secondary">{bookingData.date}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <div className="text-sm text-secondary/60">Time</div>
                                  <div className="font-semibold text-secondary">{bookingData.time}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <div className="text-sm text-secondary/60">Duration</div>
                                  <div className="font-semibold text-secondary">{bookingData.duration}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t border-primary/20 mt-6 pt-6">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-secondary">Total Amount</span>
                              <span className="text-2xl font-bold text-primary">{formatCurrency(bookingData.price)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <button
                            onClick={() => setCurrentStep(3)}
                            className="px-6 py-3 bg-white border-2 border-primary/20 text-secondary rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Details
                          </button>
                          <button
                            onClick={handleSubmitBooking}
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('book.step4.confirming')}
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {t('book.step4.confirm')}
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    )}

                    {submitStatus === 'error' && (
                      <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">Booking Error</span>
                        </div>
                        <p>{t('book.error.message')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <Chatbot />
        <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />
        <main className="relative z-10 pt-16 sm:pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-6 sm:py-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sakura text-secondary mb-4">
                Loading...
              </h1>
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
