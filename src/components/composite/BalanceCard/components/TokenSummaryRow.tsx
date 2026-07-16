import type { FC } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { EntityStackBadgePlacement } from '../../EntityStackWithBadge/types';
import { TokenAmount } from '../../TokenAmount/TokenAmount';
import { getUniqueChains, getResponsiveValue } from '../utils';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';
import type { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { TypographyProps } from '@mui/material/Typography';
import type { ResponsiveValue } from '@/types/responsive';

export interface TokenSummaryRowConfig {
  tokenSize: AvatarSize;
  chainsSize: AvatarSize;
  inlineChainsSize: AvatarSize;
  titleVariant: TypographyProps['variant'];
  descriptionVariant: TypographyProps['variant'];
  infoContainerGap?: number;
  chainsLimit?: ResponsiveValue<number>;
  chainsSpacing?: number;
}

interface TokenSummaryRowProps {
  balances: PortfolioBalance<WalletToken>[];
  config: TokenSummaryRowConfig;
}

export const TokenSummaryRow: FC<TokenSummaryRowProps> = ({
  balances,
  config,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const hasMultipleChains = balances.length > 1;
  const primaryBalance = balances[0]!;
  const chainEntities = getUniqueChains(balances);
  const resolvedChainsLimit =
    config.chainsLimit !== undefined
      ? getResponsiveValue(config.chainsLimit, isMobile)
      : undefined;

  return (
    <>
      <EntityStackWithBadge
        disableBorder
        entities={[primaryBalance.token]}
        badgeEntities={chainEntities}
        placement={
          hasMultipleChains
            ? EntityStackBadgePlacement.Inline
            : EntityStackBadgePlacement.Overlay
        }
        size={config.tokenSize}
        badgeSize={
          hasMultipleChains ? config.inlineChainsSize : config.chainsSize
        }
        badgeLimit={resolvedChainsLimit}
        content={{
          title: primaryBalance.token.symbol,
          titleVariant: config.titleVariant,
          hintVariant: config.descriptionVariant,
        }}
        spacing={{
          badge: config.chainsSpacing ?? -0.5,
          infoContainerGap: config.infoContainerGap,
        }}
      />
      {hasMultipleChains ? (
        <TokenAmount
          balances={balances}
          amountUSDVariant={config.titleVariant}
          amountVariant={config.descriptionVariant}
          compact={isMobile}
          gap={config.infoContainerGap}
          sx={{
            textAlign: 'right',
            marginLeft: 'auto',
            minWidth: 0,
          }}
        />
      ) : (
        <TokenAmount
          balance={primaryBalance}
          amountUSDVariant={config.titleVariant}
          amountVariant={config.descriptionVariant}
          compact={isMobile}
          gap={config.infoContainerGap}
          sx={{
            textAlign: 'right',
            marginLeft: 'auto',
            minWidth: 0,
          }}
        />
      )}
    </>
  );
};
