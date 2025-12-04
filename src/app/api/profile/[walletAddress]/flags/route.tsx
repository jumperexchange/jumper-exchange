import { getWalletAccessControl } from '@/app/lib/getWalletAccessControl';
import { pick } from 'lodash';
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

    const data = await getWalletAccessControl(walletAddress);

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ hasEarn: false });
    }

    const flags = data.data[0];

    return NextResponse.json(pick(flags, ['hasEarn']));
  } catch (error) {
    console.error('Error fetching wallet access control:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wallet access control data' },
      { status: 500 },
    );
  }
}
