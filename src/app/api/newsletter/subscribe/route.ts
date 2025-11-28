import envConfig from '@/config/env-config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface SubscribeRequestBody {
  email: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referringSite?: string;
  customFields?: Array<{
    name: string;
    value: string;
  }>;
}

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
  try {
    const body: SubscribeRequestBody = await request.json();

    const apiKey = envConfig.BEEHIIV_API_KEY;
    const publicationId = envConfig.BEEHIIV_PUBLICATION_ID;

    if (!apiKey || !publicationId) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }

    const payload: BeehiivSubscriptionPayload = {
      email: body.email,
      reactivate_existing: false,
      send_welcome_email: true,
    };

    if (body.utmSource) {
      payload.utm_source = body.utmSource;
    }
    if (body.utmMedium) {
      payload.utm_medium = body.utmMedium;
    }
    if (body.utmCampaign) {
      payload.utm_campaign = body.utmCampaign;
    }
    if (body.utmTerm) {
      payload.utm_term = body.utmTerm;
    }
    if (body.utmContent) {
      payload.utm_content = body.utmContent;
    }
    if (body.referringSite) {
      payload.referring_site = body.referringSite;
    }
    if (body.customFields) {
      payload.custom_fields = body.customFields;
    }

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Subscription failed' },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
