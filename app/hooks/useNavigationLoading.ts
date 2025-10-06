'use client';

import { useRouter } from 'next/navigation';
import { useLoading } from '../contexts/LoadingContext';

export function useNavigationLoading() {
  const router = useRouter();
  const { setLoading } = useLoading();

  const navigateWithLoading = (href: string, options?: { replace?: boolean }) => {
    setLoading(true);
    
    if (options?.replace) {
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  const refreshWithLoading = () => {
    setLoading(true);
    router.refresh();
  };

  const backWithLoading = () => {
    setLoading(true);
    router.back();
  };

  return {
    navigateWithLoading,
    refreshWithLoading,
    backWithLoading,
    setLoading
  };
}
