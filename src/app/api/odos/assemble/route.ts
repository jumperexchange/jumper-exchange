import envConfig from '@/config/env-config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ODOS_ASSEMBLE_URL = 'https://enterprise-api.odos.xyz/sor/assemble';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiKey = envConfig.ODOS_API_KEY;

    if (!apiKey) {
      throw Error('ODOS_API_KEY is not set');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    const res = await fetch(ODOS_ASSEMBLE_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message ?? data?.error ?? 'Odos assemble failed' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
