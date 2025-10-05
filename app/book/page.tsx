'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { SERVICES_DATA } from '../constants/services';
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

export default function BookPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('service');
  
  const [currentStep, setCurrentStep] = useState(1);
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
    // Pre-select service if coming from service card
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
        setCurrentStep(2); // Skip to date/time selection
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

  const handleServiceSelect = (service: typeof SERVICES_DATA[0]) => {
    setBookingData(prev => ({
      ...prev,
      service: t(service.nameKey),
      serviceId: service.id,
      duration: service.duration,
      price: service.price
    }));
    setCurrentStep(2);
  };

  const handleSubmitBooking = async () => {
    setIsSubmitting(true);
    try {
      // Simulate booking submission
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
    setCurrentStep(1);
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

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-8 sm:py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-sakura text-secondary mb-4">
              {t('book.hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed mb-8">
              {t('book.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* Booking Steps */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-16 sm:pb-20">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-primary to-pink-400 text-white' 
                      : 'bg-white/80 text-secondary/60 border border-primary/20'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-primary' : 'bg-primary/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div ref={stepRef} className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-primary/10">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-sakura text-secondary mb-6 text-center">
                  {t('book.step1.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICES_DATA.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="p-4 border border-primary/20 rounded-xl hover:border-primary hover:bg-primary/5 transition-all duration-300 cursor-pointer"
                    >
                      <h3 className="font-semibold text-secondary mb-2">{t(service.nameKey)}</h3>
                      <div className="flex justify-between items-center text-sm text-secondary/70">
                        <span>{service.duration}</span>
                        <span className="font-bold text-primary">{formatCurrency(service.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-sakura text-secondary mb-6 text-center">
                  {t('book.step2.title')}
                </h2>
                <div className="mb-6 p-4 bg-primary/10 rounded-xl">
                  <h3 className="font-semibold text-secondary mb-2">{t('book.selectedService')}</h3>
                  <div className="flex justify-between items-center">
                    <span>{bookingData.service}</span>
                    <span className="text-primary font-bold">{formatCurrency(bookingData.price)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      {t('book.step2.selectDate')}
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-3">
                      {t('book.step2.selectTime')}
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setBookingData(prev => ({ ...prev, time }))}
                          className={`p-2 text-xs rounded-lg border transition-all duration-300 ${
                            bookingData.time === time
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white border-primary/20 hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 bg-white border border-primary/20 text-secondary rounded-xl hover:bg-primary/5 transition-all duration-300"
                  >
                    {t('book.back')}
                  </button>
                  <button
                    onClick={() => bookingData.date && bookingData.time && setCurrentStep(3)}
                    disabled={!bookingData.date || !bookingData.time}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {t('book.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-sakura text-secondary mb-6 text-center">
                  {t('book.step3.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t('book.step3.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t('book.step3.email')} *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t('book.step3.phone')}
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none"
                      onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {t('book.step3.notes')}
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none"
                      onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-white border border-primary/20 text-secondary rounded-xl hover:bg-primary/5 transition-all duration-300"
                  >
                    {t('book.back')}
                  </button>
                  <button
                    onClick={() => bookingData.name && bookingData.email && setCurrentStep(4)}
                    disabled={!bookingData.name || !bookingData.email}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {t('book.next')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-sakura text-secondary mb-6 text-center">
                  {t('book.step4.title')}
                </h2>
                
                <div className="bg-primary/10 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-secondary mb-4">{t('book.step4.summary')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('book.step4.service')}:</span>
                      <span className="font-semibold">{bookingData.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('book.step4.date')}:</span>
                      <span className="font-semibold">{bookingData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('book.step4.time')}:</span>
                      <span className="font-semibold">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('book.step4.duration')}:</span>
                      <span className="font-semibold">{bookingData.duration}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-semibold">{t('book.step4.total')}:</span>
                      <span className="font-bold text-primary text-lg">{formatCurrency(bookingData.price)}</span>
                    </div>
                  </div>
                </div>

                {submitStatus === 'success' ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-secondary mb-2">{t('book.success.title')}</h3>
                    <p className="text-secondary/70 mb-6">{t('book.success.message')}</p>
                    <button
                      onClick={resetBooking}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      {t('book.success.newBooking')}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 bg-white border border-primary/20 text-secondary rounded-xl hover:bg-primary/5 transition-all duration-300"
                    >
                      {t('book.back')}
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-primary to-pink-400 text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {isSubmitting ? t('book.step4.confirming') : t('book.step4.confirm')}
                    </button>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center">
                    {t('book.error.message')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
