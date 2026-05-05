import type { FC } from 'react';
import Stack from '@mui/material/Stack';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { TitleWithHintSkeleton } from '@/components/composite/TitleWithHint/TitleWithHintSkeleton';
import { BALANCE_CARD_CONFIG } from '../constants';
import { BalanceCardSize } from '../types';

interface BalanceCardSkeletonProps {
  size?: BalanceCardSize;
}

export const BalanceCardSkeleton: FC<BalanceCardSkeletonProps> = ({
  size = BalanceCardSize.SM,
}) => {
  const config = BALANCE_CARD_CONFIG[size];

  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      sx={[
        {
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        },
        ...(Array.isArray(config.primary.itemSx)
          ? config.primary.itemSx
          : [config.primary.itemSx]),
      ]}
    >
      <EntityStackWithBadge
        entities={[]}
        size={config.primary.tokenSize}
        badgeSize={config.primary.chainsSize}
        spacing={{
          badge: config.chainsSpacing,
        }}
        isLoading
      />
      <TitleWithHintSkeleton />
    </Stack>
  );
};
