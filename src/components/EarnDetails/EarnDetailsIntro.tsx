'use client';

import { FC } from 'react';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { EarnCard } from '../Cards/EarnCard/EarnCard';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import { ProtocolCard } from '../Cards/ProtocolCard/ProtocolCard';

interface EarnDetailsIntroProps {
  data: EarnOpportunityWithLatestAnalytics;
  isLoading: boolean;
}

export const EarnDetailsIntro: FC<EarnDetailsIntroProps> = ({
  data,
  isLoading,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        columnGap: theme.spacing(2),
        rowGap: theme.spacing(3),
      })}
    >
      {data ? (
        <>
          <ProtocolCard data={data} isLoading={isLoading} />
          <EarnCard
            data={data}
            variant="overview"
            isLoading={isLoading}
            headerBadge={
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.SM}
                label="Updated 12 hours ago"
              />
            }
            fullWidth={isMobile}
          />
        </>
      ) : (
        <>
          <ProtocolCard data={null} isLoading />
          <EarnCard
            data={null}
            variant="overview"
            isLoading
            fullWidth={isMobile}
          />
        </>
      )}
    </Box>
  );
};
