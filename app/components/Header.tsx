'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-20 px-4 sm:px-6 py-4 lg:mx-12 xl:mx-48">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
            <Image
              src="/sakura-saloon-images/logo3.png"
              alt="Sakura Salon Logo"
              width={100}
              height={100}
              className="w-full h-full object-contain"
              priority={true}
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
          <a href="#" className="nav-item text-secondary text-sm xl:text-base font-medium transition-colors border-b-2 border-primary pb-1 hover:text-primary">
            HOME
          </a>
          <a href="#about" className="nav-item text-secondary/70 text-sm xl:text-base font-medium hover:text-primary transition-colors">
            ABOUT US
          </a>
          <a href="#services" className="nav-item text-secondary/70 text-sm xl:text-base font-medium hover:text-primary transition-colors">
            SERVICES
          </a>
          <a href="#contact" className="nav-item text-secondary/70 text-sm xl:text-base font-medium hover:text-primary transition-colors">
            CONTACT
          </a>
        </nav>

        {/* Right Side - Desktop */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          <a href="#login" className="text-secondary text-sm lg:text-base font-medium hover:text-primary transition-colors">
            Login
          </a>
          <span className="text-secondary">|</span>
          <a href="#register" className="text-secondary text-sm lg:text-base font-medium hover:text-primary transition-colors">
            Register
          </a>
          <div className="relative">
            <select className="text-secondary text-sm lg:text-base bg-transparent focus:outline-none cursor-pointer">
              <option value="en">EN</option>
              <option value="js">JS</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-secondary hover:text-primary transition-colors p-2"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-rose-50/95 backdrop-blur-sm shadow-lg z-30 animate-fadeIn">
          <nav className="flex flex-col px-6 py-4 space-y-4">
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