import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import useImageStatus from 'src/hooks/useImageStatus';
import { effigyAddressFormatter } from 'src/utils/effigyAddressFormatter';
import { numberWithCommas } from 'src/utils/formatNumbers';
import { ConnectButton } from '../ConnectButton';
import {
  LeaderboardEntryInfos,
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
  position?: number;
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
  const rankLabel = numberWithCommas(position);
  const pointsLabel = numberWithCommas(points);

  return (
    <LeaderboardEntryWrapper
      isUserPosition={isUserPosition}
      isUserEntry={isUserEntry}
      isUserConnected={isUserConnected}
    >
      <LeaderboardEntryInfos>
        <Box minWidth={74} textAlign={'center'}>
          <RankLabel variant="bodyXSmallStrong">
            {isUserEntry && !isUserConnected ? '?' : rankLabel || '-'}
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
      </LeaderboardEntryInfos>
      {isUserEntry && !isUserConnected ? (
        <ConnectButton />
      ) : (
        <RankPointsContainer>
          <Typography variant="bodyLargeStrong">{pointsLabel}</Typography>
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
