'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';
import { formatCurrency } from '../constants/currency';
import { getCart } from '../utils/cartStorage';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot,
  StripeProvider,
  PaymentForm
} from '../components';

// Load items from direct purchase or persistent cart

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

export default function CheckoutPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const [cartItems, setCartItems] = useState<Array<{id:number; name:string; price:number; image:string; quantity:number}>>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [clientSecret, setClientSecret] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string>('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [mounted, setMounted] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 99;
  const total = subtotal + shipping;

  // Initialize items: direct purchase or cart
  useEffect(() => {
    setMounted(true);
    const type = searchParams.get('type');
    if (type === 'direct') {
      try {
        const raw = typeof window !== 'undefined' ? sessionStorage.getItem('directPurchase') : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.items)) {
            setCartItems(parsed.items);
            return;
          }
        }
      } catch {}
    }
    // Fallback to cart storage
    setCartItems(getCart());
  }, [language, searchParams]);

  // Note: Do not return early before all hooks are declared (rules-of-hooks)

  // Validation function
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'name':
        if (!value.trim()) return t('checkout.validation.nameRequired');
        if (value.trim().length < 2) return t('checkout.validation.nameMinLength');
        return '';
      
      case 'email':
        if (!value.trim()) return t('checkout.validation.emailRequired');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) return t('checkout.validation.emailInvalid');
        return '';
      
      case 'phone':
        if (!value.trim()) return t('checkout.validation.phoneRequired');
        if (!/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return t('checkout.validation.phoneInvalid');
        }
        return '';

      case 'address':
        if (!value.trim()) return t('checkout.validation.addressRequired');
        return '';

      case 'city':
        if (!value.trim()) return t('checkout.validation.cityRequired');
        return '';

      case 'postalCode':
        if (!value.trim()) return t('checkout.validation.postalCodeRequired');
        return '';
      
      default:
        return '';
    }
  };

  const validateAllFields = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    Object.keys(checkoutData).forEach(field => {
      if (field !== 'notes') { // notes is optional
        const error = validateField(field, checkoutData[field as keyof CheckoutData]);
        if (error) errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFieldChange = (field: keyof CheckoutData, value: string) => {
    setCheckoutData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation as user types
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleFieldBlur = (field: keyof CheckoutData) => {
    // Validate on blur for better UX
    const value = checkoutData[field];
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  // Pre-fill form with user session data
  useEffect(() => {
    if (session?.user) {
      setCheckoutData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  // Create payment intent
  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total,
          currency: 'usd',
          orderDetails: {
            items: cartItems,
            customer: checkoutData,
            subtotal,
            shipping,
            total
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
      setPaymentError(t('checkout.payment.initError'));
    }
  };

  // Handle successful payment
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    try {
      setSubmitStatus('success');
      
      // Here you would typically:
      // 1. Clear the cart
      // 2. Send order confirmation email
      // 3. Update inventory
      // 4. Create order record in database
      
      setTimeout(() => {
        router.push('/shop?order=success');
      }, 3000);
    } catch (error) {
      console.error('Error processing successful payment:', error);
      setSubmitStatus('error');
    }
  };

  // Handle payment error
  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setSubmitStatus('error');
  };

  const proceedToPayment = async () => {
    if (validateAllFields()) {
      await createPaymentIntent();
      setCurrentStep(2);
    }
  };

  // Avoid SSR/CSR mismatch when reading browser-only storage
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="relative z-10 pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sakura text-secondary mb-4">
              {t('checkout.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed">
              {t('checkout.subtitle')}
            </p>
          </div>

          {submitStatus === 'success' ? (
            /* Success State */
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-sakura text-secondary mb-4">{t('checkout.success.title')}</h3>
              <p className="text-secondary/60 mb-8">{t('checkout.success.message')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-3">
                {currentStep === 1 ? (
                  /* Step 1: Customer Information */
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-md border border-primary/10">
                    <h3 className="text-base sm:text-lg font-sakura text-secondary mb-3 sm:mb-4">{t('checkout.step1.title')}</h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-secondary mb-1">
                            {t('checkout.step1.name')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutData.name}
                            placeholder={t('checkout.placeholders.name')}
                            className={`w-full px-3 py-2 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.name 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            onBlur={() => handleFieldBlur('name')}
                          />
                          {validationErrors.name && (
                            <div className="mt-1 text-xs text-red-600">{validationErrors.name}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-secondary mb-2">
                            {t('checkout.step1.email')} *
                          </label>
                          <input
                            type="email"
                            required
                            value={checkoutData.email}
                            placeholder={t('checkout.placeholders.email')}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.email 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            onBlur={() => handleFieldBlur('email')}
                          />
                          {validationErrors.email && (
                            <div className="mt-2 text-sm text-red-600">{validationErrors.email}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-secondary mb-2">
                          {t('checkout.step1.phone')} *
                        </label>
                        <input
                          type="tel"
                          required
                          value={checkoutData.phone}
                          placeholder={t('checkout.placeholders.phone')}
                          className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                            validationErrors.phone 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-primary/20 focus:border-primary'
                          }`}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone')}
                        />
                        {validationErrors.phone && (
                          <div className="mt-2 text-sm text-red-600">{validationErrors.phone}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-secondary mb-2">
                          {t('checkout.step1.address')} *
                        </label>
                        <input
                          type="text"
                          required
                          value={checkoutData.address}
                          placeholder={t('checkout.placeholders.address')}
                          className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                            validationErrors.address 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-primary/20 focus:border-primary'
                          }`}
                          onChange={(e) => handleFieldChange('address', e.target.value)}
                          onBlur={() => handleFieldBlur('address')}
                        />
                        {validationErrors.address && (
                          <div className="mt-2 text-sm text-red-600">{validationErrors.address}</div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-secondary mb-2">
                            {t('checkout.step1.city')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutData.city}
                            placeholder={t('checkout.placeholders.city')}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.city 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('city', e.target.value)}
                            onBlur={() => handleFieldBlur('city')}
                          />
                          {validationErrors.city && (
                            <div className="mt-2 text-sm text-red-600">{validationErrors.city}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-secondary mb-2">
                            {t('checkout.step1.postalCode')} *
                          </label>
                          <input
                            type="text"
                            required
                            value={checkoutData.postalCode}
                            placeholder={t('checkout.placeholders.postalCode')}
                            className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-primary/10 outline-none text-sm bg-white/80 backdrop-blur-sm transition-colors ${
                              validationErrors.postalCode 
                                ? 'border-red-300 focus:border-red-500' 
                                : 'border-primary/20 focus:border-primary'
                            }`}
                            onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                            onBlur={() => handleFieldBlur('postalCode')}
                          />
                          {validationErrors.postalCode && (
                            <div className="mt-2 text-sm text-red-600">{validationErrors.postalCode}</div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-secondary mb-2">
                          {t('checkout.step1.notes')}
                        </label>
                        <textarea
                          rows={3}
                          value={checkoutData.notes}
                          placeholder={t('checkout.placeholders.notes')}
                          className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none resize-none text-sm bg-white/80 backdrop-blur-sm"
                          onChange={(e) => handleFieldChange('notes', e.target.value)}
                          onBlur={() => handleFieldBlur('notes')}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        onClick={proceedToPayment}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
                      >
                        {t('checkout.proceedToPayment')}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Step 2: Payment */
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-primary/10">
                    <h3 className="text-xl font-sakura text-secondary mb-6">{t('checkout.step2.title')}</h3>
                    
                    {paymentError && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">{t('checkout.payment.error')}</span>
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
                        <p className="text-secondary/60 text-sm">{t('checkout.payment.initializing')}</p>
                      </div>
                    )}

                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 bg-white border-2 border-primary/20 text-secondary rounded-xl hover:bg-primary/5 hover:border-primary/40 transition-all duration-300"
                      >
                        {t('checkout.back')}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-md border border-primary/10 sticky top-24">
                  <h3 className="text-xl font-sakura text-secondary mb-6">{t('checkout.orderSummary')}</h3>
                  
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-secondary mb-1">{item.name}</h4>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-secondary/60">Qty: {item.quantity}</span>
                            <span className="text-sm font-semibold text-primary">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <div className="flex justify-between">
                      <span className="text-secondary/70">{t('checkout.subtotal')}</span>
                      <span className="font-semibold text-secondary">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary/70">{t('checkout.shipping')}</span>
                      <span className="font-semibold text-secondary">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="border-t border-primary/10 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-secondary">{t('checkout.total')}</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
