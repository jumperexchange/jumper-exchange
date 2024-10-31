'use client';

import { useAccount } from '@lifi/wallet-management';
import { Box } from '@mui/material';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useLeaderboardUser } from '../../hooks/useLeaderboard';
import { LeaderboardEntry } from './LeaderboardEntry';

export const LeaderboardUserEntry = () => {
  const { account } = useAccount();
  const { data: leaderboardUserData } = useLeaderboardUser(account?.address);
  const { points } = useLoyaltyPass();

  return (
    <Box marginTop={'24px'}>
      <LeaderboardEntry
        isUserEntry={true}
        isUserConnected={!!account.address}
        walletAddress={
          account?.address || '0x0000000000000000000000000000000000000000'
        }
        position={leaderboardUserData?.position ?? '-'}
        points={points || 0}
      />
    </Box>
  );
};
