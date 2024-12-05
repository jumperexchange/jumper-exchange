import { ImageResponse } from 'next/og';
import { createConfig, EVM, getTokenBalances, Solana, UTXO } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';
import { getChainsQuery } from '@/hooks/useChains';
import { walletDigest } from '@/utils/walletDigest';
import { getLeaderboardUserQuery } from '@/hooks/useLeaderboard';
import type { PDA } from '@/types/loyaltyPass';
import { getSiteUrl } from '@/const/urls';
import { getImageResponseOptions } from '@/utils/ImageGeneration/getImageResponseOptions';
import useBlockieImg from '@/hooks/useBlockieImg';

const BASE_WIDTH = 800;
const BASE_HEIGHT = BASE_WIDTH / 1.91;

// Replace by src/hooks/useLoyaltyPass.ts getLoyaltyPassDataQuery when server side ready
export interface UseLoyaltyPassProps {
  address: string;
  points?: number;
  level?: string;
  pdas?: PDA[];
}

// TODO: Replace by src/hooks/useLoyaltyPass.ts getLoyaltyPassDataQuery when server side ready
async function getLoyaltyPassData(
  walletAddress: string,
): Promise<undefined | UseLoyaltyPassProps> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await fetch(`${apiBaseUrl}/wallets/${walletAddress}/rewards`);

  if (!res.ok) {
    return undefined;
  }

  const jsonResponse = await res.json();

  if (!jsonResponse || !jsonResponse.data || !walletAddress) {
    return undefined;
  }

  const { data } = jsonResponse;

  return {
    address: walletAddress,
    points: data.sum,
    level: data.level,
    pdas: data.walletRewards,
  };
}

export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const walletAddress = (await params).walletAddress;
  const loyaltyPass = await getLoyaltyPassData(walletAddress);
  const imgLink = useBlockieImg(walletAddress);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          background: `url('${getSiteUrl()}/profile_background.png')`,
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 40,
            marginTop: 170,
            marginLeft: 80,
          }}
        >
          <div
            style={{
              width: 174,
              height: 174,
              display: 'flex',
            }}
          >
            <img
              style={{
                borderRadius: '50%',
                border: '8px solid #fff',
              }}
              src={imgLink}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              height: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                background: '#fff',
                borderRadius: 128,
                border: '8px solid #fff',
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                gap: 8,
                fontSize: '28px',
                fontWeight: 700,
                color: '#30007A',
                paddingLeft: 10,
              }}
            >
              Level {loyaltyPass?.level} • {loyaltyPass?.points}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#31007A" />
                <path
                  d="M6.22406 9.22431C5.93117 9.5172 5.93117 9.99208 6.22406 10.285L7.94728 12.0082L6.22406 13.7314C5.93117 14.0243 5.93117 14.4992 6.22406 14.7921C6.51696 15.085 6.99183 15.085 7.28472 14.7921L9.00794 13.0688L10.7311 14.792C11.024 15.0849 11.4989 15.0849 11.7918 14.792C12.0847 14.4991 12.0847 14.0243 11.7918 13.7314L10.0686 12.0082L11.7918 10.285C12.0847 9.9921 12.0847 9.51722 11.7918 9.22433C11.4989 8.93144 11.024 8.93144 10.7311 9.22433L9.00794 10.9475L7.28472 9.22431C6.99183 8.93142 6.51696 8.93142 6.22406 9.22431Z"
                  fill="white"
                />
                <path
                  d="M12.75 13.5H14.25V15H13.5C13.125 15 12.75 14.625 12.75 14.25V13.5Z"
                  fill="white"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M13.5 9C13.125 9 12.75 9.375 12.75 9.75V13.5H16.5C18 13.5 18.75 12.375 18.75 11.25C18.75 10.125 18 9 16.5 9H13.5ZM16.5 10.5H14.25V12H16.5C17.0625 12 17.25 11.5261 17.25 11.25C17.25 10.9739 17.0625 10.5 16.5 10.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                background: '#fff',
                borderRadius: 128,
                border: '8px solid #fff',
                alignItems: 'center',
                gap: 8,
                fontSize: '28px',
                fontWeight: 700,
                color: '#30007A',
                paddingLeft: 10,
              }}
            >
              {walletDigest(walletAddress)}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#31007A" />
                <path
                  d="M15 8H9C7.895 8 7 8.895 7 10V14C7 15.105 7.895 16 9 16H15C16.105 16 17 15.105 17 14V10C17 8.895 16.105 8 15 8ZM14.07 12.885C13.95 12.985 13.785 13.025 13.63 12.985L8.075 11.625C8.225 11.26 8.58 11 9 11H15C15.335 11 15.63 11.17 15.815 11.42L14.07 12.885ZM9 9H15C15.55 9 16 9.45 16 10V10.275C15.705 10.105 15.365 10 15 10H9C8.635 10 8.295 10.105 8 10.275V10C8 9.45 8.45 9 9 9Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    await getImageResponseOptions({
      debug: false,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      // scalingFactor: WIDGET_IMAGE_SCALING_FACTOR,
    }),
  );
}
