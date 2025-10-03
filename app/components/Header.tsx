'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 px-3 sm:px-4 md:px-6 py-2 sm:py-3 lg:mx-8 xl:mx-32">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12 sm:h-14 md:h-16">
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
          <a href="#" className="nav-item text-secondary text-xs lg:text-sm font-medium transition-colors border-b border-primary pb-1 hover:text-primary">
            HOME
          </a>
          <a href="#about" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors">
            ABOUT US
          </a>
          <a href="#services" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors">
            SERVICES
          </a>
          <a href="#contact" className="nav-item text-secondary/70 text-xs lg:text-sm font-medium hover:text-primary transition-colors">
            CONTACT
          </a>
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
          <a href="#login" className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors">
            Login
          </a>
          <span className="text-secondary text-xs">|</span>
          <a href="#register" className="text-secondary text-xs md:text-sm font-medium hover:text-primary transition-colors">
            Register
          </a>
          <div className="relative">
            <select className="text-secondary text-xs md:text-sm bg-transparent focus:outline-none cursor-pointer">
              <option value="en">EN</option>
              <option value="js">JS</option>
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
            <a href="#" className="text-secondary font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              HOME
            </a>
            <a href="#about" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              ABOUT US
            </a>
            <a href="#services" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              SERVICES
            </a>
            <a href="#contact" className="text-secondary/70 font-medium py-2 border-b border-primary/20 hover:text-primary transition-colors">
              CONTACT
            </a>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#login" className="text-secondary font-medium hover:text-primary transition-colors">
                Login
              </a>
              <span className="text-secondary">|</span>
              <a href="#register" className="text-secondary font-medium hover:text-primary transition-colors">
                Register
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}