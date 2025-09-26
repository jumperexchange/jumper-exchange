import { FC } from 'react';
import {
  BaseSkeleton,
  ListItemEarnCardContainer,
  ListItemEarnCardTagContainer,
  ListItemEarnContentWrapper,
} from '../EarnCard.styles';
import { EntityChainStack } from 'src/components/composite/EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from 'src/components/composite/EntityChainStack/EntityChainStack.types';
import { BadgeSkeleton } from 'src/components/Badge/BadgeSkeleton';
import { BadgeSize } from 'src/components/Badge/Badge.styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';

export const ListItemEarnCardSkeleton: FC<{}> = ({}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <ListItemEarnCardContainer>
      <ListItemEarnContentWrapper direction="row" flexWrap="wrap">
        <EntityChainStack
          variant={EntityChainStackVariant.Protocol}
          isLoading
          protocolSize={AvatarSize.XXL}
        />
        {isMobile && <BaseSkeleton variant="circular" width={40} height={40} />}
        <ListItemEarnCardTagContainer direction="row" flexWrap="wrap">
          {Array.from({ length: 5 }).map((_, index) => (
            <BadgeSkeleton key={index} size={BadgeSize.MD} />
          ))}
          {!isMobile && (
            <BaseSkeleton variant="circular" width={40} height={40} />
          )}
        </ListItemEarnCardTagContainer>
      </ListItemEarnContentWrapper>
    </ListItemEarnCardContainer>
  );
};
