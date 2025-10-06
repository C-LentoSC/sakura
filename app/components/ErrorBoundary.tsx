'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 207, 232, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(252, 231, 243, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 50% 50%, rgba(255, 228, 230, 0.2) 0%, transparent 50%)`
            }} />
          </div>

          {/* Floating Cherry Blossoms */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-float opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-pink-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                </svg>
              </div>
            ))}
          </div>

          {/* Error Content */}
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-2xl border border-primary/10">
              {/* Error Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                {/* Decorative Elements */}
                <div className="flex justify-center items-center gap-2 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-primary/40"></div>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-primary/40"></div>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-sakura text-secondary mb-4">
                  Oops! Something Went Wrong
                </h1>
                <p className="text-secondary/70 text-base sm:text-lg leading-relaxed mb-6">
                  We&apos;re sorry, but something unexpected happened. Don&apos;t worry - our team has been notified and we&apos;re working to fix this issue.
                </p>
                
                {/* Error Details (Development Mode) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="text-left bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <summary className="cursor-pointer text-red-700 font-medium mb-2">
                      Error Details (Development Mode)
                    </summary>
                    <div className="text-sm text-red-600 font-mono">
                      <p className="mb-2"><strong>Error:</strong> {this.state.error.message}</p>
                      {this.state.error.stack && (
                        <pre className="whitespace-pre-wrap text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                          {this.state.error.stack}
                        </pre>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-pink-400 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
                
                <Link
                  href="/"
                  className="px-8 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go Home
                </Link>
              </div>

              {/* Support Information */}
              <div className="mt-8 pt-6 border-t border-primary/10">
                <p className="text-secondary/60 text-sm">
                  Need help? Contact us at{' '}
                  <a 
                    href="mailto:hello@sakurasaloon.com" 
                    className="text-primary hover:text-pink-500 transition-colors font-medium"
                  >
                    hello@sakurasaloon.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Custom Styles */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
            .animate-float {
              animation: float 4s ease-in-out infinite;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
