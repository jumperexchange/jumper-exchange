import envConfig from '@/config/env-config';
import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

interface BeehiivWebhookSubscriptionData {
  id: string;
  email: string;
  status: 'active' | 'validating' | 'inactive' | 'pending';
  created_at: string;
  subscription_tier?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  referral_code?: string;
}

interface BeehiivWebhookPayload {
  event: string;
  timestamp: string;
  data: BeehiivWebhookSubscriptionData;
}

const verifyWebhookSignature = (
  payload: string,
  signature: string | null,
  secret: string,
): boolean => {
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  );
};

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const webhookSecret = envConfig.BEEHIIV_WEBHOOK_SECRET;

    console.log('Webhook received:', rawBody);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));

    if (!webhookSecret) {
      console.error('BEEHIIV_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 },
      );
    }

    const signature = request.headers.get('x-beehiiv-signature');

    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload: BeehiivWebhookPayload = JSON.parse(rawBody);

    switch (payload.event) {
      case 'subscription.confirmed': {
        const { email, status, id } = payload.data;
        console.log(
          `Newsletter subscription confirmed: ${email} (ID: ${id}, Status: ${status})`,
        );
        break;
      }

      case 'subscription.created': {
        const { email, status, id } = payload.data;
        console.log(
          `Newsletter subscription created: ${email} (ID: ${id}, Status: ${status})`,
        );
        break;
      }

      case 'subscription.deleted': {
        const { email, id } = payload.data;
        console.log(`Newsletter subscription deleted: ${email} (ID: ${id})`);
        break;
      }

      default:
        console.log(`Unhandled beehiiv webhook event: ${payload.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 },
    );
  }
}
