import { FC } from 'react';
import { PROTOCOL_CARD_SIZES } from './constants';
import {
  BaseSkeleton,
  ProtocolCardContainer,
  ProtocolCardContentContainer,
} from './ProtocolCard.styles';
import Box from '@mui/material/Box';
import { ProtocolCardProps } from './ProtocolCard';

interface ProtocolCardSkeletonProps
  extends Pick<ProtocolCardProps, 'fullWidth'> {}

export const ProtocolCardSkeleton: FC<ProtocolCardSkeletonProps> = ({
  fullWidth,
}) => {
  return (
    <ProtocolCardContainer
      sx={{
        width: '100%',
        maxWidth: fullWidth ? '100%' : PROTOCOL_CARD_SIZES.CARD_WIDTH,
      }}
    >
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: fullWidth ? '100%' : PROTOCOL_CARD_SIZES.CARD_WIDTH,
          height: PROTOCOL_CARD_SIZES.IMAGE_HEIGHT,
          backgroundColor: (theme.vars || theme).palette.surface1Hover,
        })}
      />
      <ProtocolCardContentContainer>
        <BaseSkeleton
          variant="rounded"
          sx={(theme) => ({
            height: 24,
            width: '75%',
            mt: theme.spacing(0.5),
          })}
        />
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(1.5),
          })}
        >
          <BaseSkeleton variant="rounded" sx={{ height: 16, width: '100%' }} />
          <BaseSkeleton variant="rounded" sx={{ height: 16, width: '100%' }} />
          <BaseSkeleton variant="rounded" sx={{ height: 16, width: '25%' }} />
        </Box>
      </ProtocolCardContentContainer>
    </ProtocolCardContainer>
  );
};
