'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import type { Language } from '@/app/locales/config';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface AdminSidebarProps {
  userName?: string;
  userEmail?: string;
}

export default function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, languages, t } = useLanguage();

  const navigation: NavItem[] = [
    {
      name: t('admin.sidebar.nav.dashboard'),
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.services'),
      href: '/admin/services',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.categories'),
      href: '/admin/categories',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.bookings'),
      href: '/admin/bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.users'),
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.shop'),
      href: '/admin/shop',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: t('admin.sidebar.nav.settings'),
      href: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-sm bg-white border border-pink-200 hover:bg-pink-50 transition-colors shadow-md"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

       {/* Sidebar */}
       <aside
         className={`
           fixed top-0 left-0 h-screen w-64 shadow-lg z-40
           transform transition-transform duration-300 ease-in-out
           ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
         `}
         style={{
           backgroundImage: 'url(/sakura-saloon-images/side-bg-2.jpg)',
           backgroundSize: 'cover',
          //  backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}
       >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0"></div>
        <div className="flex flex-col h-full relative z-10">
          {/* Logo/Brand */}
          <div className="p-6">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-pink-400 rounded-sm flex items-center justify-center shadow-md">
                <span className="text-white font-semibold text-sm">SA</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{t('admin.sidebar.brandTitle')}</h1>
                <p className="text-xs text-gray-500">{t('admin.sidebar.brandSubtitle')}</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-sm font-medium transition-all duration-200
                      ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                          : 'text-gray-600 hover:text-primary hover:bg-pink-50/50'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-sm">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-sm bg-white/90 backdrop-blur-md shadow-lg border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-pink-400 rounded-sm flex items-center justify-center text-white font-medium text-sm shadow-md">
                {userName ? userName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {userName || t('admin.sidebar.profile.defaultName')}
                </p>
                <p className="text-xs font-medium text-gray-700 truncate">
                  {userEmail || t('admin.sidebar.profile.defaultEmail')}
                </p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code as Language)}
                  className={`px-3 py-2 text-xs font-medium rounded-sm shadow-sm transition-all ${
                    language === l.code
                      ? 'bg-gradient-to-r from-primary to-pink-400 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:text-primary hover:bg-pink-50 border border-pink-100'
                  }`}
                >
                  {l.nativeName}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-primary bg-white hover:bg-pink-50 rounded-sm shadow-sm transition-colors text-center border border-pink-100"
              >
                {t('admin.sidebar.quickActions.viewSite')}
              </Link>
              <form action="/api/auth/logout" method="POST" className="flex-1">
                <button
                  type="submit"
                  className="w-full px-3 py-2 text-xs font-medium text-rose-500 hover:text-rose-600 bg-white hover:bg-rose-50 rounded-sm shadow-sm transition-colors border border-rose-200"
                >
                  {t('admin.sidebar.quickActions.logout')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

