'use client';

import { isProduction } from '@/utils/isProduction';
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (isProduction) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        An error occurred
        {/*<NextError />*/}
      </body>
    </html>
  );
}
