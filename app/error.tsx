'use client';

import { useEffect } from 'react';
import ErrorFallback from './components/ErrorFallback';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <ErrorFallback
      error={error}
      resetError={reset}
      title="Oops! Something went wrong"
      message="We're sorry, but something unexpected happened. Our team has been notified and we're working to fix this issue."
    />
  );
}
