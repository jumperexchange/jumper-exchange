'use client'; // Error components must be Client Components
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { captureException } from '@sentry/nextjs';

const ErrorPage = dynamic(() => import('../ui/error/ErrorPage'), {
  ssr: false,
});

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error);
    console.error(error);
  }, [error]);

  // TODO: need to integrate the statusCode once we have designs for different error pages
  // const _statusCode = error instanceof HttpError ? error.statusCode : 500;

  return <ErrorPage reset={reset} />;
}
