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
    const fetchUrl = `${baseUrl}/api/newsletter/confirm-subscription`;
    console.log('[postConfirmSubscription] Fetching:', fetchUrl);

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
      cache: 'no-store',
    });

    console.log('[postConfirmSubscription] Response status:', response.status);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log('[postConfirmSubscription] Error response:', errorMessage);
      throw new Error(errorMessage || 'Subscription failed');
    }

    const data = await response.json();
    console.log('[postConfirmSubscription] Success data:', data);

    return data;
  } catch (error) {
    console.error('[postConfirmSubscription] Error:', error);
    return { success: false };
  }
}
