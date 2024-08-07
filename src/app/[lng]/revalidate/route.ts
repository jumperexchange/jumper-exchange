// API call: /revalidate/?pathname=%2Flearn&secret=password

import { revalidatePath } from 'next/cache';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  if (secret !== process.env.NEXT_REVALIDATION_SECRET) {
    return new Response(null, { status: 403 });
  }

  const pathname = searchParams.get('pathname');
  if (pathname) {
    revalidatePath(pathname);
  }

  return Response.json({
    status: `Revalidation on '${pathname}' successful`,
  });
}
