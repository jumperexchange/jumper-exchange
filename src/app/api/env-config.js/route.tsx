/* eslint-disable @next/next/no-img-element */

import { NextResponse } from 'next/server';
import { getEnvVars } from 'src/config/env-config';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return new NextResponse(`window._env_ = ` + JSON.stringify(getEnvVars()));
}
