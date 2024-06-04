'use client';

import * as Sentry from '@sentry/nextjs';
import { isProduction } from '@/utils/isProduction';
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
        An error occured
        {/*<NextError />*/}
      </body>
    </html>
  );
}
