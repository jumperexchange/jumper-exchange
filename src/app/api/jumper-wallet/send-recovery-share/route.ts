import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { EmailTemplate } from './template';

const sendRecoveryShareSchema = z.object({
  email: z.email(),
  share: z.string().min(1),
  walletAddress: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    const parseResult = sendRecoveryShareSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parseResult.error.issues },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      //TODO, re-enable in production
      to: 'nicolas@jumper.exchange', //[parseResult.data.email],
      subject: 'DO NOT DELETE: Your Jumper Wallet Recovery Share',
      react: EmailTemplate({
        share: parseResult.data.share,
        walletAddress: parseResult.data.walletAddress,
      }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error('Unexpected error in send-recovery-share route', e);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
