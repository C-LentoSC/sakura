'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NavigationLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const [petalPositions] = useState(() => {
    // Generate random positions for petals once on component initialization
    return Array.from({ length: 6 }).map(() => ({
      left: `${20 + Math.random() * 60}%`,
      top: `${20 + Math.random() * 60}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${2 + Math.random() * 1}s`,
    }));
  });

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // Listen for route changes
    handleStart();
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      handleComplete();
    }, 500);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(251, 207, 232, 0.4) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(252, 231, 243, 0.4) 0%, transparent 50%)`
        }} />
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {petalPositions.map((style, i) => (
          <div
            key={i}
            className="absolute animate-bounce opacity-40"
            style={style}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Loading Content */}
      <div className="relative z-10 text-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-primary/20">
          {/* Loading Spinner */}
          <div className="mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto relative">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-3 sm:border-4 border-primary/20 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-3 sm:border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              {/* Inner Sakura */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-primary animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-2xl font-sakura text-secondary mb-1 sm:mb-2">
              Loading...
            </h2>
            <p className="text-secondary/70 text-xs sm:text-sm">
              Preparing your experience
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-2">
            <div className="w-6 sm:w-8 h-0.5 bg-primary/40"></div>
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary animate-pulse"></div>
            <div className="w-6 sm:w-8 h-0.5 bg-primary/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
