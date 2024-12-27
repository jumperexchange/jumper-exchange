import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { XPIcon } from 'src/components/illustrations/XPIcon';
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

import { useWalletAddressImg } from 'src/hooks/useAddressImg';
import { obfuscatedAddressFormatter } from 'src/utils/obfuscatedAddressFormatter';

interface LeaderboardEntryProps {
  isUserPosition?: boolean;
  isUserConnected?: boolean;
  isUserEntry?: boolean;
  walletAddress?: string;
  position?: number | string;
  points: number | string;
}

export const LeaderboardEntry = ({
  isUserEntry,
  isUserConnected,
  isUserPosition,
  walletAddress,
  position,
  points,
}: LeaderboardEntryProps) => {
  const { t } = useTranslation();
  const formattedAddress = obfuscatedAddressFormatter(walletAddress);
  const imgLink = useWalletAddressImg({
    userAddress: formattedAddress,
    onlyUseBlockie: true,
  });

  return (
    <LeaderboardEntryWrapper
      isUserPosition={isUserPosition}
      isUserEntry={isUserEntry}
      isUserConnected={isUserConnected}
    >
      <LeaderboardEntryInfos>
        <Box minWidth={74} textAlign={'center'}>
          <RankLabel variant="bodyXSmallStrong">
            {isUserEntry && !isUserConnected
              ? '?'
              : t('format.decimal2Digit', { value: position }) || 'N/A'}
          </RankLabel>
        </Box>
        {walletAddress ? (
          <RankWalletImage
            src={imgLink}
            alt="Blockies Wallet Icon"
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
          hide={!isUserConnected && isUserEntry}
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
          <Typography variant="bodyLargeStrong">
            {t('format.decimal2Digit', { value: points })}
          </Typography>
          <XPIcon />
        </RankPointsContainer>
      )}
    </LeaderboardEntryWrapper>
  );
};
