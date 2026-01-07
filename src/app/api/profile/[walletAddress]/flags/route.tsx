import { getWalletFlags } from '@/jumperFlags/api/getWalletFlags';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  try {
    const { walletAddress } = await params;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required' },
        { status: 400 },
      );
    }

    const flags = await getWalletFlags(walletAddress);

    return NextResponse.json(flags);
  } catch (error) {
    console.error('Error fetching wallet flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet flags' },
      { status: 500 },
    );
  }
}
