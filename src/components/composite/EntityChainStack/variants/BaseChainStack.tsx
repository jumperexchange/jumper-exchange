import { FC, ReactNode } from 'react';
import { ChainStack } from '../../ChainStack/ChainStack';
import {
  ChainStackWrapper,
  EntityChainContainer,
  EntityChainDescription,
  EntityChainInfoContainer,
  EntityChainStackWrapper,
  EntityChainTitle,
} from '../EntityChainStack.styles';
import { BaseChainStackSkeleton } from './BaseChainStackSkeleton';
import {
  AvatarSize,
  AvatarStackDirection,
} from 'src/components/core/AvatarStack/AvatarStack.types';
import type { TypographyProps } from '@mui/material/Typography';
import { BaseProps } from '../EntityChainStack.types';
import { capitalizeString } from 'src/utils/capitalizeString';

interface BaseChainStackProps extends BaseProps {
  mainStack: ReactNode;
  chainIds: string[];
  chainKeys: string[];
  skeletonSize?: AvatarSize;
  dataTestId?: string;
}

export const BaseChainStack: FC<BaseChainStackProps> = ({
  dataTestId,
  mainStack,
  chainIds,
  chainKeys,
  chainsSize = AvatarSize.XS,
  chainsLimit,
  isLoading = false,
  spacing: spacingProp = {},
  layout: layoutProp = {},
  content: contentProp = {},
  isContentVisible = true,
  skeletonSize,
}) => {
  if (isLoading) {
    return (
      <BaseChainStackSkeleton
        size={skeletonSize}
        isContentVisible={isContentVisible}
      />
    );
  }

  const spacing = {
    main: -1.5,
    chains: -1,
    containerGap: 16,
    infoContainerGap: 2,
    ...spacingProp,
  };

  const layout = {
    direction: 'row-reverse' as AvatarStackDirection,
    ...layoutProp,
  };

  const content = {
    title: '',
    titleVariant: 'titleXSmall' as TypographyProps['variant'],
    descriptionVariant: 'bodyXSmall' as TypographyProps['variant'],
    ...contentProp,
  };

  return (
    <EntityChainContainer gap={spacing.containerGap} data-testid={dataTestId}>
      <EntityChainStackWrapper>
        {mainStack}
        <ChainStackWrapper>
          <ChainStack
            chainIds={chainIds}
            size={chainsSize}
            limit={chainsLimit}
            spacing={spacing.chains}
            direction={layout.direction}
          />
        </ChainStackWrapper>
      </EntityChainStackWrapper>
      {isContentVisible && (
        <EntityChainInfoContainer gap={spacing.infoContainerGap}>
          <EntityChainTitle variant={content.titleVariant}>
            {content.title}
          </EntityChainTitle>
          <EntityChainDescription
            variant={content.descriptionVariant}
            data-testid="earn-card-chain-name"
          >
            {chainKeys.map(capitalizeString).join(' ')}
          </EntityChainDescription>
        </EntityChainInfoContainer>
      )}
    </EntityChainContainer>
  );
};
