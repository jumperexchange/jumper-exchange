import { isNewsletterFeatureEnabled } from '@/app/lib/getFeatureFlag';
import { postConfirmSubscription } from '@/app/lib/postConfirmSubscription';
import { NewsletterPage } from '@/app/ui/newsletter/NewsletterPage';
import { NewsletterPageOverlayLayout } from '@/app/ui/newsletter/NewsletterPageOverlayLayout';
import { NewsletterWelcomeScreen } from '@/app/ui/newsletter/NewsletterWelcomeScreen';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ jwt_token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  if (!isNewsletterFeatureEnabled()) {
    return notFound();
  }
  const { jwt_token } = await searchParams;
  console.log('[NewsletterConfirmPage] jwt_token present:', !!jwt_token);

  const response = await postConfirmSubscription({ jwtToken: jwt_token ?? '' });
  console.log('[NewsletterConfirmPage] response:', response);

  const isSubscriptionConfirmed = response.success;
  console.log(
    '[NewsletterConfirmPage] isSubscriptionConfirmed:',
    isSubscriptionConfirmed,
  );

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
