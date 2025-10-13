import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import {
  BaseSkeleton,
  HeroEarnCardContainer,
  HeroEarnCardContentContainer,
  HeroEarnCardFooterContainer,
  HeroEarnCardHeaderContainer,
} from './HeroEarnCard.styles';

export const HeroEarnCardSkeleton: FC<{}> = ({}) => {
  return (
    <HeroEarnCardContainer>
      <HeroEarnCardHeaderContainer direction="row">
        {Array.from({ length: 3 }).map((_, index) => (
          <BadgeSkeleton key={index} size={BadgeSize.SM} />
        ))}
      </HeroEarnCardHeaderContainer>
      <HeroEarnCardContentContainer>
        <BaseSkeleton
          variant="rounded"
          sx={{
            height: 26,
            width: '100%',
            maxWidth: '420px',
            borderRadius: 2,
            marginTop: '1rem',
            marginBottom: '1rem',
          }}
        />
      </HeroEarnCardContentContainer>
      <HeroEarnCardFooterContainer>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EntityChainStack
              variant={EntityChainStackVariant.Protocol}
              isLoading
              protocolSize={AvatarSize.XXL}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 'auto' }} sx={{ marginLeft: 'auto' }}>
            <BaseSkeleton
              variant="rounded"
              sx={{
                height: '80%',
                width: '120px',
                borderRadius: 2,
              }}
            />
          </Grid>
        </Grid>
      </HeroEarnCardFooterContainer>
    </HeroEarnCardContainer>
  );
};
