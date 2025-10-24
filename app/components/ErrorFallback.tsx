'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export default function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  message = "We're sorry, but something unexpected happened. Please try again."
}: ErrorFallbackProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 207, 232, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(252, 231, 243, 0.4) 0%, transparent 50%)`
        }} />
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-40"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 1}s`
            }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Error Content */}
      <div className="relative z-10 max-w-md mx-auto text-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-primary/20">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Decorative Line */}
            <div className="flex justify-center items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-primary/40"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-8 h-0.5 bg-primary/40"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-sakura text-secondary mb-3">
              {title}
            </h2>
            <p className="text-secondary/70 text-sm sm:text-base leading-relaxed">
              {message}
            </p>
            
            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-4 text-left bg-red-50 border border-red-200 rounded-lg p-3">
                <summary className="cursor-pointer text-red-700 text-sm font-medium">
                  Error Details
                </summary>
                <div className="mt-2 text-xs text-red-600 font-mono">
                  {error.message}
                </div>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {resetError && (
              <button
                onClick={resetError}
                className="flex-1 px-6 py-2.5 bg-gradient-to-r from-primary to-pink-400 text-white font-medium rounded-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 text-sm"
              >
                Try Again
              </button>
            )}
            
            <Link
              href="/"
              className="flex-1 px-6 py-2.5 bg-white border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all duration-300 text-sm text-center"
            >
              Go Home
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-6 pt-4 border-t border-primary/10">
            <p className="text-secondary/60 text-xs">
              Need help?{' '}
              <a 
                href="mailto:hello@sakurasaloon.com" 
                className="text-primary hover:text-pink-500 transition-colors font-medium"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
