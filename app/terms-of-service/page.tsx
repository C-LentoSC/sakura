'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
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

export default function TermsOfServicePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

      // Content sections animation
      gsap.fromTo(".terms-section",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

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
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-secondary/70 leading-relaxed">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-12 sm:pb-16 md:pb-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-primary/10">
            
            {/* Agreement to Terms */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Agreement to Terms</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed">
                Welcome to Sakura Saloon. By accessing or using our website and services, you agree to be bound by these 
                Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing this site.
              </p>
            </section>

            {/* Use of Services */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Use of Services</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-sakura text-secondary mb-3">Eligibility</h3>
                  <p className="text-secondary/80 text-sm">
                    You must be at least 18 years old to use our services. By using our services, you represent and 
                    warrant that you meet this age requirement.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-sakura text-secondary mb-3">Account Registration</h3>
                  <p className="text-secondary/80 text-sm">
                    To access certain features, you must create an account. You agree to provide accurate information 
                    and maintain the security of your account credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* Bookings and Appointments */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Bookings & Appointments</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-6">
                When you book a service through our platform, you agree to the following terms:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Booking Confirmation</h4>
                  <p className="text-sm text-secondary/80">
                    All bookings are subject to availability and confirmation. You will receive a confirmation 
                    email once your booking is confirmed.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Cancellation Policy</h4>
                  <p className="text-sm text-secondary/80">
                    Cancellations must be made at least 24 hours in advance. Late cancellations may incur a fee.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">No-Show Policy</h4>
                  <p className="text-sm text-secondary/80">
                    Failure to attend a scheduled appointment without prior notice may result in a charge.
                  </p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Rescheduling</h4>
                  <p className="text-sm text-secondary/80">
                    Appointments may be rescheduled subject to availability. Please contact us as soon as possible.
                  </p>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Payment Terms</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-4">
                All payments are processed securely through Stripe. By making a payment, you agree to:
              </p>
              <ul className="list-disc list-inside text-secondary/80 space-y-2 ml-4 mb-6">
                <li>Provide valid payment information</li>
                <li>Pay all charges at the prices in effect when incurred</li>
                <li>Pay applicable taxes and fees</li>
                <li>Authorize us to charge your payment method for all services booked</li>
              </ul>
              <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                <h4 className="font-sakura text-lg text-secondary mb-2">Refund Policy</h4>
                <p className="text-sm text-secondary/80">
                  Refunds are issued at our discretion and in accordance with our cancellation policy. 
                  Refunds may take 5-10 business days to process.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Limitation of Liability</h2>
              </div>
              <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                <p className="text-secondary/80 leading-relaxed mb-4">
                  To the maximum extent permitted by law, Sakura Saloon shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
                  directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-secondary/80 leading-relaxed">
                  Our total liability for any claims arising out of or relating to these terms or our services shall 
                  not exceed the amount you paid us in the twelve (12) months prior to the event giving rise to the liability.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="terms-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Governing Law</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Japan, without regard 
                to its conflict of law provisions. Any disputes arising from these Terms or your use of our services 
                shall be resolved in the courts of Tokyo, Japan.
              </p>
            </section>

            {/* Contact Information */}
            <section className="terms-section">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Contact Information</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-secondary/80"><strong>Email:</strong> legal@sakurasaloon.com</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-secondary/80"><strong>Phone:</strong> +1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-secondary/80"><strong>Address:</strong> 123 Sakura Street, Tokyo, Japan</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Acknowledgment */}
            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-pink-100/50 rounded-2xl border-2 border-primary/20">
              <p className="text-secondary/80 leading-relaxed font-medium text-center">
                By using Sakura Saloon&apos;s services, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms of Service.
              </p>
            </div>

          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-primary hover:bg-white hover:shadow-lg transition-all duration-300 border border-primary/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
