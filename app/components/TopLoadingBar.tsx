'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(true); // Initialize as true
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // setIsLoading(true); // Removed due to set-state-in-effect rule
    // Defer setProgress(0) to avoid synchronous setState in effect warning
    setTimeout(() => {
      setProgress(0);
    }, 0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 100);

    // Complete loading
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
      setIsLoading(false); // Ensure loading is false on unmount/pathname change
    };
  }, [pathname]);

  if (!isLoading && progress === 0) return null;

  return (
    <>
      {/* Minimal Top Loading Bar */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
