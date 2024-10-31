import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import useImageStatus from 'src/hooks/useImageStatus';
import { useLeaderboardPageStore } from 'src/stores/leaderboardPage';
import { effigyAddressFormatter } from 'src/utils/effigyAddressFormatter';
import { ConnectButton } from '../ConnectButton';
import {
  LeaderboardEntryWrapper,
  RankLabel,
  RankPointsContainer,
  RankWalletAddress,
  RankWalletImage,
} from './LeaderboardEntry.style';

interface LeaderboardEntryProps {
  isUserPosition?: boolean;
  isUserConnected?: boolean;
  isUserEntry?: boolean;
  walletAddress: string;
  position: number;
  points: number;
}

export const LeaderboardEntry = ({
  isUserEntry,
  isUserConnected,
  isUserPosition,
  walletAddress,
  position,
  points,
}: LeaderboardEntryProps) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const formattedAddress = effigyAddressFormatter(walletAddress);
  const imgLink = useImageStatus(formattedAddress);
  const { setUserPage } = useLeaderboardPageStore((state) => state);

  const handleUserPosition = (e: React.MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    setUserPage(position);
  };

  return (
    <LeaderboardEntryWrapper
      isUserPosition={isUserPosition}
      isUserEntry={isUserEntry}
      isUserConnected={isUserConnected}
      onClick={
        isUserEntry && isUserConnected
          ? (e) => handleUserPosition(e)
          : undefined
      }
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box minWidth={74} textAlign={'center'}>
          <RankLabel variant="bodyXSmallStrong">
            {isUserEntry && !isUserConnected ? '?' : position}
          </RankLabel>
        </Box>
        <RankWalletImage
          src={imgLink}
          alt="Effigy Wallet Icon"
          width={48}
          height={48}
          priority={false}
          unoptimized={true}
        />
        <RankWalletAddress variant="bodyLargeStrong">
          {isUserEntry && !isUserConnected
            ? t('leaderboard.rankCtaConnect')
            : walletAddress}
        </RankWalletAddress>
      </Box>
      {isUserEntry && !isUserConnected ? (
        <ConnectButton />
      ) : (
        <RankPointsContainer>
          <Typography variant="bodyLargeStrong">{points}</Typography>
          <XPIcon
            size={24}
            color={
              theme.palette.mode === 'light'
                ? theme.palette.primary.main
                : theme.palette.white.main
            }
            bgColor={
              theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.primary.main, 0.42)
            }
          />
        </RankPointsContainer>
      )}
    </LeaderboardEntryWrapper>
  );
};
