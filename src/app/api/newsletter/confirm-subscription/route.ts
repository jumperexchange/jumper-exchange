import envConfig from '@/config/env-config';
import { TEN_SECONDS_MS } from '@/const/time';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const confirmSubscriptionSchema = z.object({
  jwtToken: z.string().min(1),
});

interface DecodedBeehiivToken {
  publication_id: string;
  subscriber_id: string;
  [key: string]: unknown;
}

const PUBLICATION_ID_PREFIX = 'pub_';

export async function POST(request: NextRequest) {
  let timeoutId: NodeJS.Timeout | null = null;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), TEN_SECONDS_MS);

    const rawBody = await request.json();

    const parseResult = confirmSubscriptionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      throw new Error('Invalid request: jwtToken is required');
    }

    const { jwtToken } = parseResult.data;

    const decoded = jwt.decode(jwtToken) as DecodedBeehiivToken | null;

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

    const subscriptionCheckResponse = await fetch(
      `${apiUrl}/publications/${publicationId}/subscriptions/by_subscriber_id/${decoded.subscriber_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      },
    );

    if (!subscriptionCheckResponse.ok) {
      throw new Error('Subscription not found');
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Confirm subscription error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
