'use client';

import { isProduction } from '@/utils/isProduction';
import { captureException } from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isProduction) {
      captureException(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        An error occurred
        {/*<NextError />*/}
      </body>
    </html>
  );
}
