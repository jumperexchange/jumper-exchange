import { SelectCard } from '@/components/Cards/SelectCard/SelectCard';
import {
  SelectCardDescription,
  SelectCardMode,
} from '@/components/Cards/SelectCard/SelectCard.styles';
import { descriptionBoxStyles } from '../../TokenAmountInput/constants';
import Box from '@mui/material/Box';
import type { FC } from 'react';
import { useMemo } from 'react';
import { useChains } from '@/hooks/useChains';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import type { SxProps, Theme } from '@mui/material/styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStackWithBadge } from '../../EntityStackWithBadge/EntityStackWithBadge';
import { useTranslation } from 'react-i18next';

/**
 * Pure display component — not a form field, no schema.
 * Used inside custom views to summarise a token count + USD amount on a chain.
 * Receives props directly rather than reading from the form store.
 */
interface DisplayTokensAmountProps {
  chainId: number;
  noTokens: number;
  amountUSD: number;
  sx?: SxProps<Theme>;
}

export const DisplayTokensAmount: FC<DisplayTokensAmountProps> = ({
  noTokens,
  amountUSD,
  chainId,
  sx,
}) => {
  const { t } = useTranslation();
  const { toPriceDisplay } = useTokenAmountInput();
  const { getChainById } = useChains();

  const chain = useMemo(() => getChainById(chainId), [chainId, getChainById]);
  const chainName = chain?.name ?? chainId;
  const displayAmountUSD = `$${toPriceDisplay(amountUSD)}`;

  return (
    <SelectCard
      mode={SelectCardMode.Display}
      labelVariant="bodyXSmall"
      value={displayAmountUSD}
      placeholder={displayAmountUSD}
      description={
        <Box sx={descriptionBoxStyles}>
          <SelectCardDescription variant="bodyXSmall" hideOverflow>
            {t('jumperWidget.label.tokenCount', {
              count: noTokens,
              chainName: `${chainName}`,
            })}
          </SelectCardDescription>
          <SelectCardDescription
            variant="bodyXSmall"
            sx={{ lineHeight: '100%' }}
          />
        </Box>
      }
      isClickable={false}
      sx={sx}
      startAdornment={
        <EntityStackWithBadge
          entities={[{ count: noTokens }]}
          badgeEntities={chain ? [chain] : []}
          isContentVisible={false}
          size={AvatarSize.XL}
          badgeSize={AvatarSize.XXS}
        />
      }
    />
  );
};
