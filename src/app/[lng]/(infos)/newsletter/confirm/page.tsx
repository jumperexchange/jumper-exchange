import { postConfirmSubscription } from '@/app/lib/postConfirmSubscription';
import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';
import { NewsletterWelcomeScreen } from '@/app/ui/newsletter/NewsletterWelcomeScreen';

interface PageProps {
  searchParams: Promise<{ jwt_token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { jwt_token } = await searchParams;
  const response = await postConfirmSubscription({ jwtToken: jwt_token ?? '' });

  const isSubscriptionConfirmed = response.success;

  return (
    <NewsletterPageOverlayLayout
      overlayContent={
        <NewsletterWelcomeScreen
          confirmSubscription={isSubscriptionConfirmed}
        />
      }
    >
      <NewsletterPage />
    </NewsletterPageOverlayLayout>
  );
}
