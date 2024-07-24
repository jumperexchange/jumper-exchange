'use client'; // Error components must be Client Components
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';

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
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <NextThemeProvider
      themes={['dark', 'light']}
      forcedTheme={'light'}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2 themes={[]}>
        <ErrorPage reset={reset} />
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
