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

export default function PrivacyPolicyPage() {
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
      gsap.fromTo(".policy-section",
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
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />

      <div className="absolute inset-0 bg-pink-200/20 backdrop-blur-xs pointer-events-none z-0" />

      <main className="flex-1 relative z-10 pt-20 sm:pt-24 md:pt-32">
        {/* Hero Section */}
        <div ref={heroRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 md:py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sakura text-secondary mb-4 sm:mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-secondary/70 leading-relaxed">
              Last updated: January 2025
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div ref={contentRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-12 sm:pb-16 md:pb-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-primary/10">
            
            {/* Introduction */}
            <section className="policy-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Introduction</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed">
                Welcome to Sakura Saloon. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="policy-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Information We Collect</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-sakura text-secondary mb-3">Personal Information</h3>
                  <ul className="list-disc list-inside text-secondary/80 space-y-2">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Booking and appointment details</li>
                    <li>Payment information (via Stripe)</li>
                  </ul>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-xl font-sakura text-secondary mb-3">Technical Information</h3>
                  <ul className="list-disc list-inside text-secondary/80 space-y-2">
                    <li>IP address and browser type</li>
                    <li>Device information</li>
                    <li>Usage data and analytics</li>
                    <li>Cookies and tracking technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="policy-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">How We Use Your Information</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-4">
                We use your personal information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-secondary/80 space-y-2 ml-4">
                <li>To provide and maintain our services</li>
                <li>To process your bookings and appointments</li>
                <li>To send you booking confirmations and reminders</li>
                <li>To process payments securely</li>
                <li>To improve our website and services</li>
                <li>To communicate with you about our services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="policy-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Data Security</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-4">
                We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                used, or accessed in an unauthorized way. We use industry-standard encryption and security protocols including:
              </p>
              <ul className="list-disc list-inside text-secondary/80 space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/SSL)</li>
                <li>Secure password hashing with bcrypt</li>
                <li>JWT authentication with HTTP-only cookies</li>
                <li>Regular security audits and updates</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="policy-section mb-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Your Rights</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-6">
                Under data protection laws, you have the following rights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Access</h4>
                  <p className="text-sm text-secondary/80">Request access to your personal data</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Correction</h4>
                  <p className="text-sm text-secondary/80">Request correction of inaccurate data</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Deletion</h4>
                  <p className="text-sm text-secondary/80">Request deletion of your personal data</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10 hover:shadow-lg transition-all duration-300">
                  <h4 className="font-sakura text-lg text-secondary mb-2">Objection</h4>
                  <p className="text-sm text-secondary/80">Object to processing of your data</p>
                </div>
              </div>
            </section>

            {/* Contact Us */}
            <section className="policy-section">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-pink-100 flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-sakura text-secondary">Contact Us</h2>
              </div>
              <p className="text-secondary/80 leading-relaxed mb-6">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-primary/10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-secondary/80"><strong>Email:</strong> privacy@sakurasaloon.com</span>
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
