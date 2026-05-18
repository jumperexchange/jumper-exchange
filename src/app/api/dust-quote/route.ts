import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { makeLifiComposerClient } from '@/app/lib/lifi-composer-client';

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const client = makeLifiComposerClient();
    const result = await client.compose(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error,
      },
      { status: 500 },
    );
  }
};
