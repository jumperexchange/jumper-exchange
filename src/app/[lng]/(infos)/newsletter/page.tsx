import { isNewsletterFeatureEnabled } from '@/app/lib/getFeatureFlag';
import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';
import { NewsletterWelcomeScreen } from '@/app/ui/newsletter/NewsletterWelcomeScreen';
import { notFound } from 'next/navigation';

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
