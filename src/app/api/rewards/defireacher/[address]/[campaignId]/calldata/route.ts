import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFI_REACHER_API_URL } from '@/const/urls';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string; campaignId: string }> },
) {
  const { address, campaignId } = await params;

  if (!address || !campaignId) {
    return NextResponse.json(
      { error: 'Address and campaignId are required' },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `${DEFI_REACHER_API_URL}/partner/rewards/${address}/${campaignId}/calldata`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch calldata' },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching DeFi Reacher calldata:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
