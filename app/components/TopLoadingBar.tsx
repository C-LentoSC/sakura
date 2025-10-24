'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

export default function TopLoadingBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const { isLoading } = useLoading();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    if (isLoading) {
      requestAnimationFrame(() => setProgress(0));
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 30;
        });
      }, 100);
    } else {
      requestAnimationFrame(() => setProgress(100));
      completeTimer = setTimeout(() => {
        setProgress(0);
      }, 200);
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [isLoading, pathname]);

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
