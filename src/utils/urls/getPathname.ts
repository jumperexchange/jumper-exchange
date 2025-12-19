/**
 * Returns the current pathname.
 * On SSR, returns null since synchronous access to request context is not available in Next.js 15+.
 * Used by the LiFi SDK (sync) requestInterceptor to determine the integrator based on the current path.
 */
export const getPathname = (): string | null => {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }

  return null;
};
