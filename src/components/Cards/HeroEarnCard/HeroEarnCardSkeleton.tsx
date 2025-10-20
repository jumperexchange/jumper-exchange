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
  HeroEarnCardFooterContentContainer,
  HeroEarnCardHeaderContainer,
} from './HeroEarnCard.styles';

export const HeroEarnCardSkeleton: FC<{}> = ({}) => {
  return (
    <HeroEarnCardContainer sx={{ width: '100%' }}>
      <HeroEarnCardHeaderContainer direction="row">
        <BadgeSkeleton size={BadgeSize.SM} width={84} />
      </HeroEarnCardHeaderContainer>
      <HeroEarnCardContentContainer sx={{ paddingTop: 0.5 }}>
        <BaseSkeleton
          variant="rounded"
          sx={{
            height: 24,
            width: 146,
            borderRadius: 2,
          }}
        />
      </HeroEarnCardContentContainer>
      <HeroEarnCardFooterContainer>
        <HeroEarnCardFooterContentContainer>
          <EntityChainStack
            variant={EntityChainStackVariant.Protocol}
            isLoading
            isContentVisible={false}
            protocolSize={AvatarSize.XXL}
          />

          <BaseSkeleton
            variant="rounded"
            sx={{
              height: 48,
              width: 120,
              borderRadius: 2,
            }}
          />
        </HeroEarnCardFooterContentContainer>
      </HeroEarnCardFooterContainer>
    </HeroEarnCardContainer>
  );
};
