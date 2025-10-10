'use client';

import { useState } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import {
  Header,
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Footer,
  Chatbot
} from '@/app/components';

interface BookingFormData {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  additionalNotes: string;
}

export default function BookingPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    emailAddress: '',
    phoneNumber: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Session auto-fill will be implemented with new auth system

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Booking submitted:', formData);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          emailAddress: '',
          phoneNumber: '',
          service: '',
          preferredDate: '',
          preferredTime: '',
          additionalNotes: ''
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Booking submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl py-8 sm:py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sakura text-secondary mb-4">
              {t('booking.title')}
            </h1>
            <p className="text-base sm:text-lg text-secondary/70 leading-relaxed">
              {t('booking.subtitle')}
            </p>
          </div>

          {/* Success Message */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-green-800">{t('booking.success.title')}</span>
              </div>
              <p className="text-green-700">{t('booking.success.message')}</p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-red-800">{t('booking.error.title')}</span>
              </div>
              <p className="text-red-700">{t('booking.error.message')}</p>
            </div>
          )}

          {/* Booking Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-primary/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.fullName')} *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                    placeholder={t('booking.placeholders.fullName')}
                  />
                </div>

                <div>
                  <label htmlFor="emailAddress" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.emailAddress')} *
                  </label>
                  <input
                    type="email"
                    id="emailAddress"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                    placeholder={t('booking.placeholders.emailAddress')}
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                    placeholder={t('booking.placeholders.phoneNumber')}
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.service')} *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                  >
                    <option value="">{t('booking.placeholders.service')}</option>
                    <option value="dry-head-spa">{t('booking.services.dryHeadSpa')}</option>
                    <option value="japanese-head-spa">{t('booking.services.japaneseHeadSpa')}</option>
                    <option value="imperial-retreat">{t('booking.services.imperialRetreat')}</option>
                    <option value="nail-art">{t('booking.services.nailArt')}</option>
                    <option value="lash-extension">{t('booking.services.lashExtension')}</option>
                    <option value="brow-styling">{t('booking.services.browStyling')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.preferredDate')} *
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                  />
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-secondary mb-2">
                    {t('booking.form.preferredTime')} *
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm disabled:opacity-50"
                  >
                    <option value="">{t('booking.placeholders.preferredTime')}</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-secondary mb-2">
                  {t('booking.form.additionalNotes')}
                </label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  rows={4}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-secondary bg-primary/5 backdrop-blur-sm resize-none disabled:opacity-50"
                  placeholder={t('booking.placeholders.additionalNotes')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? t('booking.submitting') : t('booking.submit')}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
