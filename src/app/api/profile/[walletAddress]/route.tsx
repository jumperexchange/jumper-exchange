import { ImageResponse } from 'next/og';
import { createConfig, EVM, getTokenBalances, Solana, UTXO } from '@lifi/sdk';
import { publicRPCList } from '@/const/rpcList';
import { getChainsQuery } from '@/hooks/useChains';
import { walletDigest } from '@/utils/walletDigest';
import { getLeaderboardUserQuery } from '@/hooks/useLeaderboard';
import type { PDA } from '@/types/loyaltyPass';

const BASE_WIDTH = 700;
const BASE_HEIGHT = BASE_WIDTH / 1.91;

// Replace by src/hooks/useLoyaltyPass.ts getLoyaltyPassDataQuery when server side ready
export interface UseLoyaltyPassProps {
  address: string;
  points?: number;
  tier?: string;
  pdas?: PDA[];
}

// Replace by src/hooks/useLoyaltyPass.ts getLoyaltyPassDataQuery when server side ready
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
    tier: data.currentLevel,
    pdas: data.walletRewards,
  };
}

export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ walletAddress: string }> },
) {
  const walletAddress = (await params).walletAddress;

  // eslint-disable-next-line no-console
  console.log('init sdk config');
  createConfig({
    providers: [EVM(), Solana(), UTXO()],
    integrator: process.env.NEXT_PUBLIC_WIDGET_INTEGRATOR,
    rpcUrls: {
      ...JSON.parse(process.env.NEXT_PUBLIC_CUSTOM_RPCS),
      ...publicRPCList,
    },
    preloadChains: true,
  });

  // eslint-disable-next-line no-console
  console.log('staring fetching');

  const { chains } = await getChainsQuery();
  // eslint-disable-next-line no-console
  console.log('finished fetching chains');
  const tokens = await getTokenBalances(
    walletAddress,
    chains.map((chain) => chain.nativeToken),
  );
  // eslint-disable-next-line no-console
  console.log('finished fetching tokenbalances');

  const tokensToDisplay = tokens.filter(
    (token) => token.amount ?? 0 > BigInt(0n),
  );
  const chainsToDisplay = tokensToDisplay.map(
    (token) => chains.find((chain) => chain.id === token.chainId)?.logoURI,
  );

  const leaderboardUser = await getLeaderboardUserQuery({
    queryKey: [, walletAddress],
  }).then(({ data }) => data);

  // eslint-disable-next-line no-console
  console.log('finished fetching leaderboard');

  const loyaltyPass = await getLoyaltyPassData(walletAddress);
  // eslint-disable-next-line no-console
  console.log('finished fetching loyalty pass');

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            gap: '20px',
          }}
        >
          <div
            style={{
              width: 128,
              height: 128,
              display: 'flex',
            }}
          >
            {/*            <img
              style={{ borderRadius: '50%' }}
              src={`https://effigy.im/a/${walletAddress}.png`}
            />*/}
          </div>
          <div
            style={{
              display: 'flex',
              flexGrow: 1,
            }}
          >
            {walletDigest(walletAddress)}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              LVL: 9
            </div>
            <div
              style={{
                display: 'flex',
              }}
            >
              Rank: {leaderboardUser.position}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            margin: 10,
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Traits
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <img
                style={{ width: 50, height: 50 }}
                src="https://jumper.exchange/apple-touch-icon-180x180.png"
              />
              <img
                style={{ width: 50, height: 50 }}
                src="https://jumper.exchange/apple-touch-icon-180x180.png"
              />
              <img
                style={{ width: 50, height: 50 }}
                src="https://jumper.exchange/apple-touch-icon-180x180.png"
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Chains
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              {/*              {chainsToDisplay.map((logoURI) => (
                <img
                  style={{ width: 50, height: 50, borderRadius: '50%' }}
                  src={logoURI}
                />
              ))}*/}
            </div>
          </div>
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            margin: 10,
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            Latest completed missions
            <div
              style={{
                display: 'flex',
              }}
            >
              {/*              {loyaltyPass?.pdas?.slice(0, 10).map((pda) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <img
                    style={{
                      width: 60,
                      height: 60,
                    }}
                    src={pda.reward.image}
                  />
                </div>
              ))}*/}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      debug: true,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
    },
  );
}
