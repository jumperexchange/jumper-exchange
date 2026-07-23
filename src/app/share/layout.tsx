import type { ReactNode } from 'react';

/**
 * Minimal layout for social share landing pages. These pages are intentionally
 * kept outside the localized `[lng]` tree (and excluded from the i18n
 * middleware) so they don't pull in the full app shell — their only job is to
 * expose social-card metadata to crawlers and redirect visitors.
 */
export default function ShareLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
