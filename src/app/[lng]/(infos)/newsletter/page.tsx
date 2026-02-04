import { isNewsletterFeatureEnabled } from '@/app/lib/getFeatureFlag';
import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';
import { NewsletterWelcomeScreen } from '@/app/ui/newsletter/NewsletterWelcomeScreen';
import { siteName } from 'src/app/lib/metadata';
import { getSiteUrl } from '@/const/urls';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: `Newsletter | ${siteName}`,
  description:
    'Newsletter for Jumper - Learn about the latest news and updates.',
  openGraph: {
    title: `Newsletter | ${siteName}`,
    description:
      'Newsletter for Jumper - Learn about the latest news and updates.',
    url: `${getSiteUrl()}/newsletter`,
    siteName,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Newsletter | ${siteName}`,
    description:
      'Newsletter for Jumper - Learn about the latest news and updates.',
  },
  alternates: {
    canonical: `${getSiteUrl()}/newsletter`,
  },
};

export default function Page() {
  if (!isNewsletterFeatureEnabled()) {
    return notFound();
  }
  return (
    <NewsletterPageOverlayLayout overlayContent={<NewsletterWelcomeScreen />}>
      <NewsletterPage />
    </NewsletterPageOverlayLayout>
  );
}
