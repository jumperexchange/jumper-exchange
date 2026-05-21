import type { NextRequest } from 'next/server';
import { parseErrorOperation } from '@/utils/prometheus/errorOperations';
import { recordServerError } from '@/utils/prometheus/recordError';

export const dynamic = 'force-dynamic';

export const POST = async (request: NextRequest) => {
  const body: unknown = await request.json().catch(() => null);
  const rawOperation =
    body &&
    typeof body === 'object' &&
    'operation' in body &&
    typeof body.operation === 'string'
      ? body.operation
      : null;

  recordServerError(parseErrorOperation(rawOperation));
  return new Response('success', { status: 200 });
};
