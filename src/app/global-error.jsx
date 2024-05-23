'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';
import { isProduction } from '../utils/isProduction';

export default function GlobalError({ error }) {
  useEffect(() => {
    if (isProduction) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <Error />
      </body>
    </html>
  );
}
