'use client';
import { useEffect } from 'react';

interface PnlShareRedirectProps {
  /** Absolute URL visitors are forwarded to (the Jumper referral link). */
  target: string;
}

/**
 * The `/share/pnl` landing page exists purely so X can unfurl the personalized
 * card image from its metadata. Real visitors are redirected client-side to the
 * Jumper referral link — a client redirect (not an HTTP 3xx) so social crawlers
 * still read the page's `twitter:image` / `og:image` meta before any redirect.
 *
 * Deliberately dependency-free (no MUI / providers) so the redirect page stays
 * lightweight and does not pull in the full app shell.
 */
export const PnlShareRedirect = ({ target }: PnlShareRedirectProps) => {
  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
      }}
    >
      <p>
        Redirecting you to Jumper…{' '}
        <a href={target}>Continue if you are not redirected.</a>
      </p>
    </main>
  );
};
