import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFI_REACHER_API_URL } from '@/const/urls';
import { isHex } from 'viem';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txHash: string }> },
) {
  const { txHash } = await params;

  if (!txHash) {
    return NextResponse.json({ error: 'TxHash is required' }, { status: 400 });
  }

  if (!isHex(txHash)) {
    return NextResponse.json({ error: 'Invalid TxHash' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${DEFI_REACHER_API_URL}/partner/validate?txHash=${txHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Failed to validate hash. ${error}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error validating DeFi Reacher hash:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
