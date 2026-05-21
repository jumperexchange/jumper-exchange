import { NextResponse } from 'next/server';
import { register } from 'prom-client';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  try {
    const registry = global.prometheusRegistry ?? register;
    const metrics = await registry.metrics();

    return new NextResponse(metrics, {
      headers: {
        'Content-Type': register.contentType,
      },
    });
  } catch (error) {
    console.error(error, 'Error generating prometheus metrics');
    return new NextResponse('Error generating metrics', { status: 500 });
  }
};
