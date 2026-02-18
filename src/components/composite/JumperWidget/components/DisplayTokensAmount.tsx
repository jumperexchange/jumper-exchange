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
import { AvatarItem } from '@/components/core/AvatarStack/AvatarItem';
import {
  ChainStackWrapper,
  EntityChainStackWrapper,
} from '../../EntityChainStack/EntityChainStack.styles';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import Typography from '@mui/material/Typography';

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
  const { toPriceDisplay } = useTokenAmountInput();
  const { getChainById } = useChains();
  const chain = useMemo(() => {
    return getChainById(chainId);
  }, [chainId, getChainById]);

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
            {`${noTokens} tokens on ${chainName}`}
          </SelectCardDescription>
          <SelectCardDescription
            variant="bodyXSmall"
            sx={{ lineHeight: '100%' }}
          ></SelectCardDescription>
        </Box>
      }
      isClickable={false}
      sx={sx}
      // This needs to be replaced with a variant of EntityStackWithBadge once the PR is merged
      startAdornment={
        <EntityChainStackWrapper>
          <Box
            sx={(theme) => ({
              height: 40,
              width: 40,
              background: (theme.vars || theme).palette.primary.main,
              borderRadius: theme.shape.radiusRoundedFull,
              position: 'relative',
            })}
          >
            <Typography
              variant="bodyMediumStrong"
              color="white"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {noTokens}
            </Typography>
          </Box>
          {chain && (
            <ChainStackWrapper>
              <AvatarItem
                avatar={{
                  src: chain?.logoURI,
                  alt: chain?.name,
                  id: chain.id.toString(),
                }}
                size={AvatarSize.XXS}
                disableBorder={false}
              />
            </ChainStackWrapper>
          )}
        </EntityChainStackWrapper>
      }
    />
  );
};
