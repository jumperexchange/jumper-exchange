import 'server-only';

import envConfig from '@/config/env-config';
import { TEN_SECONDS_MS } from '@/const/time';
import jwt from 'jsonwebtoken';

interface NewsletterConfirmSubscriptionDto {
  jwtToken?: string | null;
}

interface PostConfirmSubscriptionResponse {
  success: boolean;
}

interface DecodedBeehiivToken {
  publication_id: string;
  subscriber_id: string;
  [key: string]: unknown;
}

const PUBLICATION_ID_PREFIX = 'pub_';

export async function postConfirmSubscription(
  props: NewsletterConfirmSubscriptionDto,
): Promise<PostConfirmSubscriptionResponse> {
  let timeoutId: NodeJS.Timeout | null = null;

  try {
    if (!props.jwtToken) {
      throw new Error('JWT token is required');
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), TEN_SECONDS_MS);

    const decoded = jwt.decode(props.jwtToken) as DecodedBeehiivToken | null;

    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }

    const apiKey = envConfig.BEEHIIV_API_KEY;
    const publicationId = envConfig.BEEHIIV_PUBLICATION_ID;
    const apiUrl = envConfig.BEEHIIV_API_URL || 'https://api.beehiiv.com/v2';

    if (!apiKey || !publicationId) {
      throw new Error('Missing environment variables');
    }

    if (`${PUBLICATION_ID_PREFIX}${decoded.publication_id}` !== publicationId) {
      throw new Error('Invalid publication');
    }

    if (!decoded.subscriber_id) {
      throw new Error('Invalid token: missing subscriber_id');
    }

    const subscriptionCheckUrl = `${apiUrl}/publications/${publicationId}/subscriptions/by_subscriber_id/${decoded.subscriber_id}`;

    const subscriptionCheckResponse = await fetch(subscriptionCheckUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!subscriptionCheckResponse.ok) {
      const errorText = await subscriptionCheckResponse.text();
      console.error('[postConfirmSubscription] Beehiiv error:', errorText);
      throw new Error('Subscription not found');
    }

    return { success: true };
  } catch (error) {
    console.error('Error confirming subscription:', error);
    return { success: false };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
