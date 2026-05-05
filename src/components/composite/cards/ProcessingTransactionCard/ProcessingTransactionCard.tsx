import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import type { ExtendedToken } from '@/types/tokens';
import { EntityChainStack } from '../../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../../EntityChainStack/EntityChainStack.types';
import { ProcessingTransactionCardContainer } from './ProcessingTransactionCard.styles';
import { ARROW_ICON_SIZE } from './constants';
import {
  ProcessingTransactionCardStatus,
  type ProcessingTransactionCardProps,
} from './types';
import { getStatusConfig } from './utils';
import { Timer } from './Timer';

const WrappedEntityStack: FC<{ token: ExtendedToken; zIndex: number }> = ({
  token,
  zIndex,
}) => (
  <Box sx={{ zIndex, position: 'relative' }}>
    <EntityChainStack
      variant={EntityChainStackVariant.Tokens}
      tokens={[
        {
          ...token,
          chain: {
            chainId: token.chainId,
            chainKey: '',
          },
        },
      ]}
      tokensSize={AvatarSize.XL}
      chainsSize={AvatarSize.XXS}
      isContentVisible={false}
    />
  </Box>
);

export const ProcessingTransactionCard: FC<ProcessingTransactionCardProps> = ({
  status = ProcessingTransactionCardStatus.PENDING,
  fromToken,
  toToken,
  title,
  description,
  targetTime,
  onClick,
}) => {
  const statusConfig = getStatusConfig(status);

  return (
    <ProcessingTransactionCardContainer status={status} onClick={onClick}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="title2XSmall">{title}</Typography>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: 'center',
          }}
        >
          {targetTime !== undefined && <Timer target={targetTime} />}
          {statusConfig.icon}
        </Stack>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
        }}
      >
        <Stack direction="row" spacing={-1.25}>
          <WrappedEntityStack token={fromToken} zIndex={1} />
          <WrappedEntityStack token={toToken} zIndex={0} />
        </Stack>

        <Stack spacing={0.5}>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              alignItems: 'center',
            }}
          >
            <Typography variant="bodyLargeStrong">
              {fromToken.symbol}
            </Typography>
            <ArrowForwardIcon
              sx={{ height: ARROW_ICON_SIZE, width: ARROW_ICON_SIZE }}
            />
            <Typography variant="bodyLargeStrong">{toToken.symbol}</Typography>
          </Stack>
          <Typography
            variant="bodyXSmall"
            sx={(theme) => ({
              color: statusConfig.getDescriptionColor(theme),
            })}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </ProcessingTransactionCardContainer>
  );
};
