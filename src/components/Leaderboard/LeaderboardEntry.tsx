import { alpha, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
import { numberWithCommas } from 'src/utils/formatNumbers';
import { walletDigest } from 'src/utils/walletDigest';
import { ConnectButton } from '../ConnectButton';
import {
  LeaderboardEntryInfos,
  LeaderboardEntryWrapper,
  RankLabel,
  RankPointsContainer,
  RankWalletAddress,
  RankWalletImage,
  RankWalletImageSkeleton,
} from './LeaderboardEntry.style';
import { effigyAddressFormatter } from 'src/utils/effigyAddressFormatter';
import { useWalletAddressImg } from 'src/hooks/useAddressImg';

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
  const imgLink = useWalletAddressImg(formattedAddress);
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
          <RankWalletImageSkeleton variant="circular" width={48} height={48} />
        )}

        <RankWalletAddress
          variant="bodyLargeStrong"
          isUserConnected={isUserConnected}
          isUserEntry={isUserEntry}
        >
          {isUserEntry && !isUserConnected
            ? t('leaderboard.rankCtaConnect')
            : walletDigest(walletAddress)}
        </RankWalletAddress>
      </LeaderboardEntryInfos>
      {isUserEntry && !isUserConnected ? (
        <ConnectButton
          id={'leaderboard-entry-connect-button'}
          label={t('leaderboard.connectWallet')}
        />
      ) : (
        <RankPointsContainer>
          <Typography variant="bodyLargeStrong">{pointsLabel}</Typography>
          <XPIcon
            size={24}
            color={theme.palette.text.primary}
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
