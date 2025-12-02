import envConfig from '@/config/env-config';
import { TEN_SECONDS_MS } from '@/const/time';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email().max(80),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  referringSite: z.string().optional(),
  customFields: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),
});

interface BeehiivSubscriptionPayload {
  email: string;
  reactivate_existing: boolean;
  send_welcome_email: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referring_site?: string;
  custom_fields?: Array<{
    name: string;
    value: string;
  }>;
}

export async function POST(request: NextRequest) {
  let timeoutId: NodeJS.Timeout | null = null;
  try {
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), TEN_SECONDS_MS);

    const rawBody = await request.json();

    const parseResult = subscribeSchema.safeParse(rawBody);

    if (!parseResult.success) {
      throw new Error(parseResult.error.message);
    }

    const body = parseResult.data;

    const apiKey = envConfig.BEEHIIV_API_KEY;
    const publicationId = envConfig.BEEHIIV_PUBLICATION_ID;
    const apiUrl = envConfig.BEEHIIV_API_URL || 'https://api.beehiiv.com/v2';

    if (!apiKey || !publicationId) {
      throw new Error('Server error');
    }

    const encodedEmail = encodeURIComponent(body.email);
    const subscriptionCheckResponse = await fetch(
      `${apiUrl}/publications/${publicationId}/subscriptions/by_email/${encodedEmail}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
      },
    );

    if (subscriptionCheckResponse.ok) {
      return NextResponse.json({
        success: true,
        message: 'Subscription successful',
      });
    }

    const subscribePayload: BeehiivSubscriptionPayload = {
      email: body.email,
      reactivate_existing: false,
      send_welcome_email: true,
    };

    if (body.utmSource) {
      subscribePayload.utm_source = body.utmSource;
    }
    if (body.utmMedium) {
      subscribePayload.utm_medium = body.utmMedium;
    }
    if (body.utmCampaign) {
      subscribePayload.utm_campaign = body.utmCampaign;
    }
    if (body.utmTerm) {
      subscribePayload.utm_term = body.utmTerm;
    }
    if (body.utmContent) {
      subscribePayload.utm_content = body.utmContent;
    }
    if (body.referringSite) {
      subscribePayload.referring_site = body.referringSite;
    }
    if (body.customFields) {
      subscribePayload.custom_fields = body.customFields;
    }

    const subscribeResponse = await fetch(
      `${apiUrl}/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscribePayload),
        signal: controller.signal,
      },
    );

    if (!subscribeResponse.ok) {
      const errorMessage = await subscribeResponse.text();
      return NextResponse.json(
        { error: errorMessage || 'Subscription failed' },
        { status: subscribeResponse.status },
      );
    }

    const subscribeData = await subscribeResponse.json();
    return NextResponse.json({ success: true, data: subscribeData });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
