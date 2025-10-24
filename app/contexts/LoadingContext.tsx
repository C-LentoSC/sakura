'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import TopLoadingBar from '../components/TopLoadingBar';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
  useTopBar?: boolean;
}

export function LoadingProvider({ children, useTopBar = true }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
      {useTopBar ? <TopLoadingBar /> : (isLoading && <NavigationLoadingOverlay />)}
    </LoadingContext.Provider>
  );
}

function NavigationLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      {/* Minimal Loading Content */}
      <div className="text-center">
        {/* Simple Spinner */}
        <div className="mb-3">
          <div className="w-8 h-8 mx-auto relative">
            <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Minimal Text */}
        <p className="text-sm text-gray-600 font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
