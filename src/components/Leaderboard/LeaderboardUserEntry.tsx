'use client';

import { useAccount } from '@lifi/wallet-management';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useLeaderboardUser } from '../../hooks/useLeaderboard';
import { LeaderboardEntry } from './LeaderboardEntry';
import { LeaderboardUserEntryBox } from './LeaderboardUserEntry.style';

export const LeaderboardUserEntry = () => {
  const { account } = useAccount();
  const { data: leaderboardUserData } = useLeaderboardUser(account?.address);
  const { points } = useLoyaltyPass();

  return (
    <LeaderboardUserEntryBox
      href={`/leaderboard?page=${leaderboardUserData.userPage}`}
    >
      <LeaderboardEntry
        isUserEntry={true}
        isUserConnected={!!account.address}
        walletAddress={
          account?.address || '0x0000000000000000000000000000000000000000'
        }
        position={parseInt(leaderboardUserData?.position)}
        points={points || 0}
      />
    </LeaderboardUserEntryBox>
  );
};
