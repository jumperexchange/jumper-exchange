import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';

export default function Page() {
  return (
    <NewsletterPageOverlayLayout>
      <NewsletterPage />
    </NewsletterPageOverlayLayout>
  );
}
