import { type PropsWithChildren } from 'react';
import { useHydrated } from './useHydrated';

interface ClientOnlyProps extends PropsWithChildren {
  fallback?: React.ReactNode;
}

/**
 * Render the children only after the JS has loaded client-side. Use an optional
 * fallback component if the JS is not yet loaded.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const hydrated = useHydrated();
  return hydrated ? children : fallback;
}
