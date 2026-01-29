import { NextResponse } from 'next/server';
import { getPublicEnvVars } from 'src/config/env-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return new NextResponse(
    `window._env_ = ` + JSON.stringify(getPublicEnvVars()),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
      },
    },
  );
}
