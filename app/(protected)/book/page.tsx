'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Header,
  Footer,
  Chatbot,
  StripeProvider,
  PaymentForm
} from '@/app/components';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { formatCurrency } from '@/app/constants/currency';
import { generateTimeSlots, getShopHours, type TimeSlot } from '@/app/utils/timeSlots';
import { addBooking, getBlockedTimeSlots, getBookedTimeSlots } from '@/app/utils/bookingStorage';
import { useServices } from '@/app/hooks/useServices';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  nameKey: string;
  price: number;
  duration: string;
}

interface bookingsData {
  service: string;
  serviceId: string;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedServiceId = searchParams.get('service');
  const { services, isLoading: servicesLoading } = useServices({});

  const [currentStep, setCurrentStep] = useState(2);
  const [bookingsData, setbookingsData] = useState<bookingsData>({
    service: '',
    serviceId: '',
    date: '',
    time: '',
    duration: '',
    price: 0,
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [shopHours, setShopHours] = useState<{isOpen: boolean; openTime?: string; closeTime?: string; hasBreak?: boolean; breakTime?: string}>({isOpen: false});
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');

  const heroRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load service data from URL parameter
    const loadService = () => {
      if (!preSelectedServiceId) {
        // No service selected, redirect to services page
        router.push('/services');
        return;
      }

      if (servicesLoading) return; // Wait for services to load

      const service = services.find((s: Service) => s.id === preSelectedServiceId);

      if (service) {
        setbookingsData(prev => ({
          ...prev,
          service: t(service.nameKey),
          serviceId: service.id,
          duration: service.duration,
          price: service.price
        }));
      } else {
        // Invalid service ID, redirect to services page
        router.push('/services');
      }
    };

    loadService();
  }, [preSelectedServiceId, router, t, services, servicesLoading]);

  // Auto-fill from logged-in user (name, email)
  useEffect(() => {
    let cancelled = false;
    const loadUser = async () => {
      try {
        const res = await fetch('/api/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.isAuth && data.user) {
          setbookingsData(prev => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || '',
          }));
        }
      } catch {
        // ignore
      }
    };
    loadUser();
    return () => { cancelled = true; };
  }, []);

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

  // Generate time slots when date changes
  useEffect(() => {
    if (bookingsData.date) {
      const serviceDuration = bookingsData.duration ? 
        parseInt(bookingsData.duration.replace(' min', '')) : 60;
      
      // Generate available time slots
      const slots = generateTimeSlots(bookingsData.date, serviceDuration);
      
      // Get already blocked time slots for this date (includes full duration ranges)
      const blockedTimes = getBlockedTimeSlots(bookingsData.date);
      
      // Mark blocked slots as unavailable
      const slotsWithBookingStatus = slots.map(slot => ({
        ...slot,
        isAvailable: slot.isAvailable && !blockedTimes.includes(slot.time)
      }));
      
      setAvailableTimeSlots(slotsWithBookingStatus);
      
      // Get shop hours
      const hours = getShopHours(bookingsData.date);
      setShopHours(hours);
      
      // Clear selected time if it's no longer available
      if (bookingsData.time && !slotsWithBookingStatus.find(slot => slot.time === bookingsData.time)?.isAvailable) {
        setbookingsData(prev => ({ ...prev, time: '' }));
      }
    } else {
      setAvailableTimeSlots([]);
      setShopHours({isOpen: false});
    }
  }, [bookingsData.date, bookingsData.duration, bookingsData.time]);

  // Validation functions
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return t('book.validation.nameRequired');
        if (value.trim().length < 2) return t('book.validation.nameMinLength');
        // More permissive name validation - allow letters, numbers, spaces, and common punctuation
        if (!/^[a-zA-Z0-9\s.-]+$/.test(value.trim())) return t('book.validation.nameInvalid');
        return '';
      
      case 'email':
        if (!value.trim()) return t('book.validation.emailRequired');
        // Stricter email validation - optional subdomains 2-4 letters, final top-level domain 2-3 letters
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,4})*\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(value.trim())) return t('book.validation.emailInvalid');
        return '';
      
      case 'phone':
        if (value.trim() && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return t('book.validation.phoneInvalid');
        }
        return '';
      
      default:
        return '';
    }
  };

  const validateAllFields = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validate required fields
    errors.name = validateField('name', bookingsData.name);
    errors.email = validateField('email', bookingsData.email);
    errors.phone = validateField('phone', bookingsData.phone);
    
    // Remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: string, value: string) => {
    // Update booking data
    setbookingsData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Validate field if it's been touched
    if (touchedFields[field] || value.trim()) {
      const error = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, bookingsData[field as keyof typeof bookingsData] as string);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  // Removed unused canProceedToConfirmation helper (was causing lint warning)

  // Create payment intent when moving to confirmation step
  const createPaymentIntent = async () => {
    try {
      // Validate required booking data
      if (!bookingsData.service || !bookingsData.price || bookingsData.price <= 0) {
        throw new Error('Service and price are required');
      }
      
      if (!bookingsData.date || !bookingsData.time) {
        throw new Error('Date and time are required');
      }
      
      if (!bookingsData.name || !bookingsData.email) {
        throw new Error('Name and email are required');
      }

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: bookingsData.price,
          currency: 'usd',
          bookingDetails: {
            service: bookingsData.service,
            date: bookingsData.date,
            time: bookingsData.time,
            name: bookingsData.name,
            email: bookingsData.email,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        throw new Error('No client secret received');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError(t('book.payment.initError'));
    }
  };

  // Handle successful payment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    try {
      // Prepare booking data
      const bookingData = {
        service: bookingsData.service,
        image: '/packages/1.jpg', // Default image - can be enhanced to fetch from API
        date: bookingsData.date,
        time: bookingsData.time,
        duration: bookingsData.duration,
        price: bookingsData.price
      };
      
      // Save booking to localStorage using the utility with validation
      const result = addBooking(bookingData);
      
      if (result.success) {
        // Persist booking to database for admin visibility
        try {
          await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceId: bookingsData.serviceId,
              date: bookingsData.date,
              time: bookingsData.time,
              name: bookingsData.name,
              email: bookingsData.email,
              phone: bookingsData.phone,
              notes: bookingsData.notes,
            }),
          });
        } catch {
          // Non-blocking: even if DB save fails, the client flow continues
        }
        setSubmitStatus('success');
        
        // Redirect to bookings page after 2 seconds
        setTimeout(() => {
          router.push('/bookings');
        }, 2000);
      } else {
        // Handle validation errors
        console.error('Booking validation failed:', result.errors);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error saving booking:', error);
      setSubmitStatus('error');
    }
  };

  // Handle payment errors
  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setSubmitStatus('error');
  };

  // Removed unused handleSubmitbookings (replaced by payment flow)

  const resetbookings = () => {
    setbookingsData({
      service: '',
      serviceId: '',
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
        <BackgroundPattern />
        <CherryBlossomTrees />
        <FallingPetals />
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-secondary/60">Loading service...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-6xl py-4 sm:py-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-sakura text-secondary mb-4">
{t('book.hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/60 leading-relaxed max-w-2xl mx-auto">
              {t('book.hero.subtitle')}
            </p>
          </div>
        </div>

        {/* bookings Container */}
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-6xl pb-8 sm:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            
            {/* Left Sidebar - Progress & Service Info */}
            <div className="lg:col-span-3 xl:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                {/* Progress Steps */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-primary/10">
                  <h3 className="font-semibold text-secondary mb-4 text-sm">{t('book.progress.title')}</h3>
                  <div className="space-y-4">
                    {[
                      { step: 2, label: t('book.progress.step2'), icon: 'calendar' },
                      { step: 3, label: t('book.progress.step3'), icon: 'user' },
                      { step: 4, label: t('book.progress.step4'), icon: 'check' }
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
                {bookingsData.service && (
                  <div className="bg-gradient-to-br from-primary/10 via-pink-50/50 to-amber-50/30 rounded-2xl p-6 border border-primary/20">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-sakura text-lg text-secondary mb-1">{t('book.selectedService')}</h3>
                        <p className="text-secondary/60 text-sm">{t('book.selectedService.subtitle')}</p>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-xl p-4">
                      <h4 className="font-semibold text-secondary mb-2">{bookingsData.service}</h4>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-secondary/70">Duration: {bookingsData.duration}</span>
                        <span className="font-bold text-primary text-lg">{formatCurrency(bookingsData.price)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - bookings Steps */}
            <div className="lg:col-span-9 xl:col-span-8">
              <div ref={stepRef} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
                {/* Step 1: Date & Time Selection */}
                {currentStep === 2 && (
                  <div className="p-4 sm:p-6">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">{t('book.step2.title')}</h2>
                          <p className="text-sm text-secondary/60">{t('book.step2.subtitle')}</p>
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
{t('book.step2.selectDate')}
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm"
                            onChange={(e) => setbookingsData(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-4">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
{t('book.step2.selectTime')}
                        </label>
                        
                        {/* Shop Hours Info */}
                        {shopHours.isOpen && (
                          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{t('book.shopHours')}: {shopHours.openTime} - {shopHours.closeTime}</span>
                              {shopHours.hasBreak && (
                                <span className="text-blue-600">• Break: {shopHours.breakTime}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {!shopHours.isOpen && bookingsData.date && (
                          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                            <div className="text-red-800 font-medium">Shop is closed on this day</div>
                            <div className="text-red-600 text-sm mt-1">Please select a different date</div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {availableTimeSlots.map((slot) => (
                            <button
                              key={slot.value}
                              onClick={() => slot.isAvailable && setbookingsData(prev => ({ ...prev, time: slot.time }))}
                              disabled={!slot.isAvailable}
                              className={`w-full h-10 text-sm font-medium rounded-lg border-2 transition-all duration-300 flex items-center justify-center relative ${
                                bookingsData.time === slot.time
                                  ? 'bg-gradient-to-r from-primary to-pink-400 text-white border-primary shadow-lg scale-105'
                                  : slot.isAvailable
                                  ? 'bg-white/80 border-primary/20 hover:border-primary hover:bg-primary/5 hover:scale-105'
                                  : 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed relative'
                              }`}
                              title={!slot.isAvailable ? (getBookedTimeSlots(bookingsData.date).includes(slot.time) ? 'Already booked' : slot.conflictReason) : undefined}
                            >
                              {slot.time}
                              {!slot.isAvailable && getBookedTimeSlots(bookingsData.date).includes(slot.time) && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  </svg>
                                </div>
                              )}
                              {slot.isBooked && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        {availableTimeSlots.length === 0 && bookingsData.date && shopHours.isOpen && (
                          <div className="text-center py-8 text-secondary/60">
                            <svg className="w-12 h-12 mx-auto mb-3 text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="font-medium">No time slots available</div>
                            <div className="text-sm">All slots are booked for this date</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-primary/10">
                      <button
                        onClick={() => bookingsData.date && bookingsData.time && setCurrentStep(3)}
                        disabled={!bookingsData.date || !bookingsData.time}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                      >
{t('book.next')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Information */}
                {currentStep === 3 && (
                  <div className="p-4 sm:p-6">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">{t('book.step3.title')}</h2>
                          <p className="text-sm text-secondary/60">{t('book.step3.subtitle')}</p>
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
{t('book.step3.name')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={bookingsData.name}
                            placeholder={t('book.placeholders.name')}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.name 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            onBlur={() => handleFieldBlur('name')}
                          />
                          {validationErrors.name && (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {validationErrors.name}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
{t('book.step3.email')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={bookingsData.email}
                            placeholder={t('book.placeholders.email')}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.email 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={() => handleFieldBlur('email')}
                          />
                          {validationErrors.email && (
                            <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {validationErrors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
{t('book.step3.phone')} (Optional)
                        </label>
                        <input
                          type="tel"
                          value={bookingsData.phone}
                          placeholder={t('book.placeholders.phone')}
                          className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                            validationErrors.phone 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-primary/20 focus:border-primary'
                          }`}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                        />
                        {validationErrors.phone && (
                          <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationErrors.phone}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-3">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
{t('book.step3.notes')} (Optional)
                        </label>
                        <textarea
                          rows={4}
                          placeholder={t('book.placeholders.notes')}
                          className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none text-sm bg-white/80 backdrop-blur-sm"
                          onChange={(e) => setbookingsData(prev => ({ ...prev, notes: e.target.value }))}
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
{t('book.backToDateTime')}
                      </button>
                      <button
                        onClick={async () => {
                          if (validateAllFields()) {
                            await createPaymentIntent();
                            setCurrentStep(4);
                          }
                        }}
                        disabled={!bookingsData.name.trim() || !bookingsData.email.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center gap-2"
                      >
{t('book.step4.title')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 4 && (
                  <div className="p-4 sm:p-6">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-xl font-sakura text-secondary">{t('book.step4.title')}</h2>
                          <p className="text-sm text-secondary/60">{t('book.step4.subtitle')}</p>
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
                          onClick={resetbookings}
                          className="px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          {t('book.success.newbookings')}
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Responsive Layout */}
                        <div className="space-y-6">
                          {/* Booking Summary Section */}
                          <div className="bg-gradient-to-br from-primary/5 to-pink-50/50 rounded-xl p-4 border border-primary/10">
                            <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2 text-lg">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
{t('book.step4.summary')}
                            </h3>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                              <div className="text-center sm:text-left">
                                <div className="text-xs text-secondary/60 mb-1">{t('book.step4.service')}</div>
                                <div className="font-semibold text-secondary text-sm">{bookingsData.service}</div>
                              </div>
                              
                              <div className="text-center sm:text-left">
                                <div className="text-xs text-secondary/60 mb-1">{t('book.step4.date')}</div>
                                <div className="font-semibold text-secondary text-sm">{bookingsData.date}</div>
                              </div>
                              
                              <div className="text-center sm:text-left">
                                <div className="text-xs text-secondary/60 mb-1">{t('book.step4.time')}</div>
                                <div className="font-semibold text-secondary text-sm">{bookingsData.time}</div>
                              </div>
                              
                              <div className="text-center sm:text-left">
                                <div className="text-xs text-secondary/60 mb-1">{t('book.step4.duration')}</div>
                                <div className="font-semibold text-secondary text-sm">{bookingsData.duration}</div>
                              </div>
                            </div>
                            
                            <div className="border-t border-primary/20 pt-4">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-secondary">{t('book.step4.total')}</span>
                                <span className="text-xl font-bold text-primary">{formatCurrency(bookingsData.price)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Payment Details Section */}
                          <div className="bg-white rounded-xl p-4 border border-primary/10">
                            <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2 text-lg">
                              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
{t('book.paymentDetails')}
                            </h3>
                            
                            {paymentError && (
                              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="font-semibold">{t('book.payment.error')}</span>
                                </div>
                                <p>{paymentError}</p>
                              </div>
                            )}

                            {clientSecret ? (
                              <StripeProvider clientSecret={clientSecret}>
                                <PaymentForm
                                  onPaymentSuccess={handlePaymentSuccess}
                                  onPaymentError={handlePaymentError}
                                  isProcessing={isProcessingPayment}
                                  setIsProcessing={setIsProcessingPayment}
                                />
                              </StripeProvider>
                            ) : (
                              <div className="text-center py-6">
                                <svg className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></svg>
                                <p className="text-secondary/60 text-sm">{t('book.payment.initializing')}</p>
                              </div>
                            )}
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
{t('book.back')}
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
                          <span className="font-semibold">bookings Error</span>
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
        <main className="flex-1 relative z-10 pt-20 sm:pt-24">
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
