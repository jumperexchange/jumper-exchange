import { useWalletMenu } from '@lifi/wallet-management';
import { alpha, Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import useImageStatus from 'src/hooks/useImageStatus';
import { effigyAddressFormatter } from 'src/utils/effigyAddressFormatter';
import { numberWithCommas } from 'src/utils/formatNumbers';
import { walletDigest } from 'src/utils/walletDigest';
import {
  LeaderboardEntryConnect,
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
  walletAddress?: string;
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
  const { openWalletMenu } = useWalletMenu();

  return (
    <LeaderboardEntryWrapper
      isUserPosition={isUserPosition}
      isUserEntry={isUserEntry}
      isUserConnected={isUserConnected}
    >
      <LeaderboardEntryInfos>
        <Box minWidth={74} textAlign={'center'}>
          <RankLabel variant="bodyXSmallStrong">
            {isUserEntry && !isUserConnected ? '?' : rankLabel || 'N/A'}
          </RankLabel>
        </Box>
        {walletAddress ? (
          <RankWalletImage
            src={imgLink}
            alt="Effigy Wallet Icon"
            isUserEntry={isUserEntry}
            width={48}
            height={48}
            priority={false}
            unoptimized={true}
          />
        ) : (
          <Skeleton variant="circular" width={48} height={48} />
        )}

        <RankWalletAddress variant="bodyLargeStrong">
          {isUserEntry && !isUserConnected
            ? t('leaderboard.rankCtaConnect')
            : walletDigest(walletAddress)}
        </RankWalletAddress>
      </LeaderboardEntryInfos>
      {isUserEntry && !isUserConnected ? (
        <LeaderboardEntryConnect
          id={'leaderboard-entry-connect-button'}
          onClick={(event) => {
            event.stopPropagation();
            openWalletMenu();
          }}
        >
          <Typography variant="bodySmallStrong">
            {t('leaderboard.connectWallet')}
          </Typography>
        </LeaderboardEntryConnect>
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
