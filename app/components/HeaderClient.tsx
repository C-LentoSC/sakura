'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../locales/config';
import { logout } from '../(auth)/logout/actions';
import { getCachedUser, setCachedUser, clearCachedUser, CachedUser } from '../lib/cache';

export default function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Start null to match server-rendered HTML and avoid hydration mismatch
  const [user, setUser] = useState<CachedUser>(null);
  const { language, setLanguage, t, languages } = useLanguage();
  const pathname = usePathname();

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  // Revalidate on mount (refresh) and on external triggers (visibility, pageshow, CRUD events)
  useEffect(() => {
    let mounted = true;

    async function revalidate() {
      try {
        const res = await fetch('/api/auth/user');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setUser(data.user);
        setCachedUser(data.user);
      } catch {
        // keep existing cached user on failure
      }
    }

    // Apply cached user after hydration (avoids hydration mismatch) and then revalidate
    const cached = getCachedUser();
    if (cached && cached.user) {
      setUser(cached.user as CachedUser);
    }

    // Always revalidate on mount so refresh/initial load triggers a background update
    revalidate();

    // Revalidate when page becomes visible (tab focus) or when pageshow (bfcache restore) occurs
    const onVisibility = () => {
      if (document.visibilityState === 'visible') revalidate();
    };
    const onPageShow = () => revalidate();

    // Allow other parts of the app to trigger a revalidation after CRUD operations
    const onExternalRevalidate = () => revalidate();

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pageshow', onPageShow);
    window.addEventListener('sakura:user-revalidate', onExternalRevalidate);

    return () => {
      mounted = false;
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('sakura:user-revalidate', onExternalRevalidate);
    };
  }, []);

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
          <Link
            href="/"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.home')}
          </Link>
          <Link
            href="/about"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/about')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.about')}
          </Link>
          <Link
            href="/services"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/services')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.services')}
          </Link>
          <Link
            href="/shop"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/shop')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.shop')}
          </Link>
          <Link
            href="/bookings"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/bookings')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.bookings')}
          </Link>
          <Link
            href="/contact"
            className={`nav-item text-xs lg:text-sm font-medium transition-colors border-b-2 ${
              isActive('/contact')
                ? 'text-primary border-primary'
                : 'text-secondary/70 border-transparent hover:border-primary hover:text-primary'
            }`}
          >
            {t('nav.contact')}
          </Link>
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors leading-none"
              >
                {t('nav.welcome')}, {user.name || user.email}
              </Link>
              <form action={logout} className="inline">
                <button
                  type="submit"
                  onClick={() => clearCachedUser()}
                  className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors leading-none"
                >
                  {t('nav.signOut')}
                </button>
              </form>
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
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-primary/10 z-30 animate-fadeIn">
          <nav className="flex flex-col px-4 py-4 space-y-0">
            <Link
              href="/"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">{t('nav.home')}</span>
            </Link>

            <Link
              href="/about"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/about')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">{t('nav.about')}</span>
            </Link>

            <Link
              href="/services"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/services')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-sm font-medium">{t('nav.services')}</span>
            </Link>

            <Link
              href="/shop"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/shop')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-sm font-medium">{t('nav.shop')}</span>
            </Link>

            <Link
              href="/bookings"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/bookings')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{t('nav.bookings')}</span>
            </Link>

            <Link
              href="/contact"
              className={`flex items-center gap-3 font-medium py-3 px-3 rounded-lg transition-all duration-300 group ${
                isActive('/contact')
                  ? 'bg-primary/10 text-primary'
                  : 'text-secondary/70 hover:bg-primary/5 hover:text-primary'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{t('nav.contact')}</span>
            </Link>
            
            {/* Divider */}
            <div className="border-t border-primary/10 my-3"></div>
            
            {/* Auth Section - Mobile */}
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-secondary text-xs px-3 py-2 hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-3 h-3 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">{t('nav.welcome')}, {user.name || user.email}</span>
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                    onClick={() => { setMobileMenuOpen(false); clearCachedUser(); }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {t('nav.signOut')}
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link 
                  href="/login" 
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('nav.login')}
                </Link>
                <Link 
                  href="/register" 
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-all duration-300 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {t('nav.register')}
                </Link>
              </div>
            )}
            
            {/* Language Selector */}
            <div className="flex items-center justify-center gap-2 pt-3">
              <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="text-secondary text-xs bg-transparent focus:outline-none cursor-pointer border border-primary/20 rounded px-2 py-1"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

