
'use client';

import React from 'react';
import Image from 'next/image';
import Header from './components/Header';

export default function Home() {

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Magic Pattern Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'repeat',
          backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3CclipPath id=%22a%22%3E%3Cpath fill=%22currentColor%22 d=%22M854.5 637Q718 774 580.5 761.5T273 720q-170-29-103.5-188T331 275q95-98 275-115.5T888.5 321q102.5 179-34 316Z%22%2F%3E%3C%2FclipPath%3E%3C%2Fdefs%3E%3Cg clip-path=%22url(%23a)%22%3E%3Cpath fill=%22%23FFB7C5%22 d=%22M854.5 637Q718 774 580.5 761.5T273 720q-170-29-103.5-188T331 275q95-98 275-115.5T888.5 321q102.5 179-34 316Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E")'
        }}
      />
      
      {/* Left Side Cherry Blossom Tree */}
      <div className="hidden lg:block fixed left-0 top-20 bottom-0 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/L-tree.png"
          alt="Left Cherry Blossom Tree"
          width={1920}
          height={1000}
          className="h-50 w-100 object-cover opacity-80"
        />
      </div>
      {/* Left Side Cherry Blossom Tree */}
      <div className="hidden lg:block fixed left-0 bottom-0 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/L4-tree.png"
          alt="Left Cherry Blossom Tree"
          width={1920}
          height={1000}
          className="h-120 w-full object-cover opacity-80"
        />
      </div>

      {/* Right Side Cherry Blossom Tree */}
      <div className="hidden lg:block fixed right-0 top-80 pointer-events-none z-0">
        <Image
          src="/sakura-saloon-images/R2-tree.png"
          alt="Right Cherry Blossom Tree"
          width={1920}
          height={1024}
          className="h-95 w-162 object-cover opacity-60"
        />
      </div>

      {/* Falling Petals (Separate Layer) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[
          { x: '15%', y: '20%', delay: 0, duration: 8 },
          { x: '25%', y: '35%', delay: 1, duration: 10 },
          { x: '18%', y: '50%', delay: 2, duration: 9 },
          { x: '30%', y: '15%', delay: 1.5, duration: 11 },
          { x: '22%', y: '65%', delay: 0.5, duration: 10 },
          { x: '12%', y: '40%', delay: 2.5, duration: 9 },
          { x: '35%', y: '25%', delay: 3, duration: 12 },
          { x: '20%', y: '75%', delay: 1, duration: 10 },
          { x: '65%', y: '30%', delay: 2, duration: 11 },
          { x: '70%', y: '50%', delay: 1.5, duration: 9 },
          { x: '75%', y: '20%', delay: 3, duration: 10 },
          { x: '80%', y: '45%', delay: 0.5, duration: 12 },
          { x: '8%', y: '60%', delay: 1.8, duration: 9 },
          { x: '42%', y: '10%', delay: 2.2, duration: 11 },
          { x: '55%', y: '70%', delay: 0.8, duration: 10 },
          { x: '38%', y: '55%', delay: 4, duration: 8 },
          { x: '85%', y: '35%', delay: 1.2, duration: 12 },
          { x: '5%', y: '80%', delay: 3.5, duration: 9 },
          { x: '60%', y: '15%', delay: 0.3, duration: 11 },
          { x: '90%', y: '60%', delay: 2.8, duration: 10 },
          { x: '28%', y: '85%', delay: 1.7, duration: 8 },
          { x: '50%', y: '5%', delay: 4.2, duration: 12 },
          { x: '10%', y: '25%', delay: 0.7, duration: 9 },
          { x: '78%', y: '75%', delay: 3.2, duration: 11 },
          { x: '45%', y: '40%', delay: 1.4, duration: 10 },
          { x: '95%', y: '25%', delay: 2.6, duration: 8 },
          { x: '33%', y: '90%', delay: 0.9, duration: 12 },
          { x: '88%', y: '10%', delay: 3.8, duration: 9 }
        ].map((petal, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: petal.x,
              top: petal.y,
              animationDelay: `${petal.delay}s`,
              animationDuration: `${petal.duration}s`
            }}
          >
            <svg width="20" height="25" viewBox="0 0 20 25">
              <ellipse
                cx="10"
                cy="12"
                rx="8"
                ry="10"
                fill="#FFB7C5"
                opacity="0.6"
                transform="rotate(15 10 12)"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Header Navigation */}
      <Header />

      {/* Main Content - Full Viewport Hero */}
      <main className="relative z-10 px-4 sm:px-6 lg:mx-12 xl:mx-48 h-[calc(100vh-80px)] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          {/* Compact Hero Section - Everything in viewport */}
          <div className="text-center">
            {/* Decorative Quote Above Title - Compact */}
            <div className="mb-3 sm:mb-4">
              <p className="text-secondary/60 text-xs sm:text-sm italic font-light tracking-wider">
                &ldquo;Where Beauty Blooms Like Cherry Blossoms&rdquo;
              </p>
              <div className="flex items-center justify-center mt-1 sm:mt-2">
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <div className="mx-2">
                  <svg className="w-2 h-2 sm:w-3 sm:h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              </div>
            </div>

            {/* Main Title - Bigger Text */}
            <div className="mb-4 sm:mb-6">
              <h1 className="font-sakura text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] 2xl:text-[16rem] text-secondary leading-none">
                Sakura
                <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] tracking-widest leading-none">salon</span>
              </h1>
              
              <p className="text-secondary/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-md lg:max-w-xl mx-auto mt-2 sm:mt-4 px-2">
                Welcome to Sakura Salon, your cozy retreat for relaxation and rejuvenation. Experience our range of services designed to pamper you from head to toe.
              </p>
            </div>

            {/* Action Buttons - Compact */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button className="sakura-button inline-flex items-center px-6 sm:px-8 py-2 sm:py-2.5 border-2 border-primary text-primary text-sm sm:text-base font-medium rounded-full hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
                BOOKING NOW
              </button>
              <button className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-2.5 text-secondary/70 text-sm sm:text-base font-medium hover:text-primary transition-all duration-300 hover:scale-105">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Our Story
              </button>
            </div>

            {/* Features Section - Horizontal Compact Layout */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 max-w-4xl mx-auto">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-secondary text-xs sm:text-sm md:text-base font-medium mb-1">Premium Products</h3>
                <p className="text-secondary/60 text-xs sm:text-sm hidden sm:block">Organic and natural beauty products for the best care</p>
              </div>

              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-secondary text-xs sm:text-sm md:text-base font-medium mb-1">Expert Stylists</h3>
                <p className="text-secondary/60 text-xs sm:text-sm hidden sm:block">Professional team with years of experience</p>
              </div>

              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-secondary text-xs sm:text-sm md:text-base font-medium mb-1">Relaxing Atmosphere</h3>
                <p className="text-secondary/60 text-xs sm:text-sm hidden sm:block">Peaceful environment for your complete relaxation</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}