'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../locales/config';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { language, setLanguage, t, languages } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 px-4 sm:px-6 md:px-6 lg:px-8 xl:px-32 bg-gradient-to-b from-rose-50/95 via-pink-50/80 to-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-14 md:h-16">
        {/* Logo */}
        <div className="flex items-center">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
            <Image
              src="/sakura-saloon-images/logo3.png"
              alt="Sakura Salon Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
              priority={true}
            />
          </div>
          <span className="ml-2 sm:ml-3 text-secondary font-medium text-sm sm:text-base md:text-lg tracking-wider">Sakura</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
          <Link href="/" className="nav-item text-secondary text-xs lg:text-sm font-medium transition-colors border-b-2 border-transparent hover:border-primary hover:text-primary">
            {t('nav.home')}
          </Link>
          <Link href="/about" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
            {t('nav.about')}
          </Link>
          <Link href="/services" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
            {t('nav.services')}
          </Link>
          <Link href="/bookings" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
            {t('nav.bookings')}
          </Link>
          <Link href="/contact" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
            {t('nav.contact')}
          </Link>
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
          {session ? (
            <>
              <span className="text-secondary text-xs md:text-sm leading-none">
                Welcome, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors leading-none"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors leading-none">
                {t('nav.login')}
              </Link>
              <span className="text-secondary text-xs leading-none">|</span>
              <Link href="/register" className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors leading-none">
                {t('nav.register')}
              </Link>
            </>
          )}
          <div className="relative ml-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="text-secondary text-xs md:text-sm bg-transparent focus:outline-none cursor-pointer leading-none py-0"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.code.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-secondary hover:text-primary transition-colors p-1"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-rose-50/95 backdrop-blur-sm shadow-lg z-30 animate-fadeIn">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <Link href="/" className="text-secondary font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/about" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              {t('nav.about')}
            </Link>
            <Link href="/services" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              {t('nav.services')}
            </Link>
            <Link href="/bookings" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              {t('nav.bookings')}
            </Link>
            <Link href="/contact" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              {t('nav.contact')}
            </Link>
            <div className="flex items-center space-x-4 pt-2">
              <Link href="/login" className="text-secondary font-medium hover:text-primary transition-colors">
                {t('nav.login')}
              </Link>
              <span className="text-secondary">|</span>
              <Link href="/register" className="text-secondary font-medium hover:text-primary transition-colors">
                {t('nav.register')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}