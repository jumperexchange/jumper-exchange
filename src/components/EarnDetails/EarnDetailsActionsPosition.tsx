import Box from '@mui/material/Box';
import type { TooltipProps } from '@mui/material/Tooltip';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Address } from 'viem';

import { useToken } from '@/hooks/useToken';
import type { Token } from '@/types/jumper-backend';

import { formatUSD } from '../../utils/formatNumbers';
import { SimpleToken } from '../../utils/Token';
import { SelectCard } from '../Cards/SelectCard/SelectCard';
import { SelectCardMode } from '../Cards/SelectCard/SelectCard.styles';
import { AvatarSize } from '../core/AvatarStack/AvatarStack.types';
import { Tooltip } from '../core/Tooltip/Tooltip';
import { EntityStackWithBadge } from '../composite/EntityStackWithBadge/EntityStackWithBadge';

interface EarnDetailsActionsPositionProps {
  token: Token;
  amountUSD?: number;
  amount?: bigint | number;
}

const selectCardStyles = {
  padding: 0,
  borderRadius: 0,
  boxShadow: 'none',
  background: 'transparent',
  '& .MuiInputLabel-root': {
    color: 'text.secondary',
  },
} as const;

const tooltipSlotProps: TooltipProps['slotProps'] = {
  popper: {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, -12],
        },
      },
    ],
  },
} as const;

export const EarnDetailsActionsPosition: FC<
  EarnDetailsActionsPositionProps
> = ({ token, amountUSD, amount }) => {
  const { t } = useTranslation();

  const { token: extendedToken } = useToken(
    token.chain.chainId,
    token.address as Address,
    // Get with USD price information
    { extended: true },
  );

  const priceData = useMemo(() => {
    if (extendedToken?.hasPriceUSD()) {
      let formattedAmount: string;
      let formattedAmountUSD: string;

      if (amount) {
        formattedAmount = extendedToken.formatAmount(amount);
        formattedAmountUSD = extendedToken.formatAmountUSD(amount);
      } else if (amountUSD) {
        formattedAmount = extendedToken.formatAmountFromUSD(amountUSD);
        formattedAmountUSD = formatUSD(amountUSD);
      } else {
        formattedAmount = extendedToken.formatZeroAmount();
        formattedAmountUSD = extendedToken.formatZeroUSD();
      }

      return {
        formattedAmount,
        formattedAmountUSD,
        hasAmount: (amount && amount > 0) || (amountUSD && amountUSD > 0),
      };
    } else {
      const simpleToken = new SimpleToken(token);
      return {
        formattedAmount: simpleToken.formatAmount(amount || 0),
        formattedAmountUSD: simpleToken.formatZeroUSD(),
        hasAmount: false,
      };
    }
  }, [token, extendedToken, amount, amountUSD]);

  return (
    <Tooltip
      title={
        !priceData.hasAmount ? t('tooltips.noPositionsToManage') : undefined
      }
      placement="top"
      enterTouchDelay={0}
      arrow
      slotProps={tooltipSlotProps}
    >
      <Box>
        <SelectCard
          mode={SelectCardMode.Display}
          value={priceData.formattedAmountUSD}
          description={priceData.formattedAmount}
          placeholder="0"
          isClickable={false}
          startAdornment={
            <EntityStackWithBadge
              entities={[token]}
              badgeEntities={[token.chain]}
              size={AvatarSize.XL}
              badgeSize={AvatarSize.XXS}
              isContentVisible={false}
            />
          }
          sx={
            priceData.hasAmount
              ? selectCardStyles
              : { ...selectCardStyles, cursor: 'not-allowed' }
          }
        />
      </Box>
    </Tooltip>
  );
};
