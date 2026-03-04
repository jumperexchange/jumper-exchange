import envConfig from '@/config/env-config';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ODOS_INFO_BASE = 'https://enterprise-api.odos.xyz';

export interface OdosRouterResponse {
  deprecated?: string;
  traceId?: string;
  address: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ chainId: string }> },
) {
  try {
    const { chainId } = await params;
    const apiKey = envConfig.ODOS_API_KEY;

    if (!apiKey) {
      throw Error('ODOS_API_KEY is not set');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    };

    const res = await fetch(
      `${ODOS_INFO_BASE}/info/router/v3/${encodeURIComponent(chainId)}`,
      { method: 'GET', headers },
    );

    const data = (await res.json().catch(() => ({}))) as OdosRouterResponse & {
      error?: string;
      message?: string;
    };

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message ?? data?.error ?? 'Odos router fetch failed' },
        { status: res.status },
      );
    }

    if (!data.address) {
      return NextResponse.json(
        { error: 'No router address in response' },
        { status: 502 },
      );
    }

    return NextResponse.json({
      deprecated: data.deprecated,
      traceId: data.traceId,
      address: data.address,
    } satisfies OdosRouterResponse);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
