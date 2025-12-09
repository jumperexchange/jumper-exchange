import { getSiteUrl } from '@/const/urls';

interface NewsletterConfirmSubscriptionDto {
  jwtToken?: string | null;
}

interface PostConfirmSubscriptionResponse {
  success: boolean;
}

export async function postConfirmSubscription(
  props: NewsletterConfirmSubscriptionDto,
): Promise<PostConfirmSubscriptionResponse> {
  try {
    if (!props.jwtToken) {
      throw new Error('JWT token is required');
    }
    const baseUrl = getSiteUrl();
    const response = await fetch(
      `${baseUrl}/api/newsletter/confirm-subscription`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Subscription failed');
    }

    return data;
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return { success: false };
  }
}
