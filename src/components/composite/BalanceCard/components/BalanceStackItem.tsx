import type { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackBadgePlacement } from '../../EntityStackWithBadge/types';
import { TokenAmount } from '../../TokenAmount/TokenAmount';
import { StyledContent } from '../BalanceCard.styles';
import type { BalanceStackItemProps } from '../types';
import type { Chain } from '@/types/jumper-backend';

export const BalanceStackItem: FC<BalanceStackItemProps> = ({
  balance,
  config,
  isClickable,
  onClick,
  compact = false,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const chainEntity: Chain | undefined = balance.token.chainKey
    ? { chainId: balance.token.chainId, chainKey: balance.token.chainKey }
    : undefined;

  const badgeEntities = chainEntity ? [chainEntity] : [];

  return (
    <StyledContent
      hideCursor={!isClickable}
      direction="row"
      spacing={2}
      useFlexGap
      onClick={onClick}
      sx={[
        { justifyContent: 'space-between', alignItems: 'center' },
        ...(Array.isArray(config.itemSx) ? config.itemSx : [config.itemSx]),
      ]}
    >
      <EntityStackWithBadge
        entities={[balance.token]}
        badgeEntities={badgeEntities}
        placement={EntityStackBadgePlacement.Overlay}
        size={config.tokenSize}
        badgeSize={config.chainsSize}
        content={{
          title: balance.token.symbol,
          titleVariant: config.titleVariant,
          hintVariant: config.descriptionVariant,
        }}
        spacing={{
          infoContainerGap: config.infoContainerGap,
        }}
      />
      <TokenAmount
        balance={balance}
        amountUSDVariant={config.titleVariant}
        amountVariant={config.descriptionVariant}
        compact={compact || isMobile}
        gap={config.infoContainerGap}
        sx={{
          textAlign: 'right',
          marginLeft: 'auto',
          minWidth: 0,
        }}
      />
    </StyledContent>
  );
};
