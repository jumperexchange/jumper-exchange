import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';
import { NewsletterWelcomeScreen } from '@/app/ui/newsletter/NewsletterWelcomeScreen';

export default function Page() {
  return (
    <NewsletterPageOverlayLayout
      overlayContent={<NewsletterWelcomeScreen confirmSubscription />}
    >
      <NewsletterPage />
    </NewsletterPageOverlayLayout>
  );
}
