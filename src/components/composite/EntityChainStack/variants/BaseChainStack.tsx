import { type FC, type ReactNode } from 'react';
import { ChainStack } from '../../ChainStack/ChainStack';
import {
  ChainStackWrapper,
  EntityChainContainer,
  EntityChainStackWrapper,
} from '../EntityChainStack.styles';
import { BaseChainStackSkeleton } from './BaseChainStackSkeleton';
import type { AvatarStackDirection } from 'src/components/core/AvatarStack/AvatarStack.types';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import type { TypographyProps } from '@mui/material/Typography';
import type { BaseProps } from '../EntityChainStack.types';
import { EntityChainStackChainsPlacement } from '../EntityChainStack.types';
import { capitalizeString } from 'src/utils/capitalizeString';
import { TitleWithHint } from '../../TitleWithHint/TitleWithHint';
import { EntityExplorerLink } from '../components/EntityExplorerLink';

interface BaseChainStackProps extends BaseProps {
  mainStack: ReactNode;
  chainIds: string[];
  chainKeys: string[];
  skeletonSize?: AvatarSize;
  dataTestId?: string;
  assetAddresses?: string[];
}

export const BaseChainStack: FC<BaseChainStackProps> = ({
  assetAddresses,
  dataTestId,
  mainStack,
  chainIds,
  chainKeys,
  chainsSize = AvatarSize.XS,
  chainsLimit,
  chainsPlacement = EntityChainStackChainsPlacement.Overlay,
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
    containerGap: 2,
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

  const chainsStack = (
    <ChainStack
      chainIds={chainIds}
      size={chainsSize}
      limit={chainsLimit}
      spacing={spacing.chains}
      direction={layout.direction}
    />
  );

  const hintOnHover =
    assetAddresses && assetAddresses.length === 1 && chainIds.length === 1 ? (
      <EntityExplorerLink
        address={assetAddresses[0]}
        chainId={chainIds[0]}
        hintVariant={content.descriptionVariant}
      />
    ) : null;

  return (
    <EntityChainContainer
      sx={{ gap: spacing.containerGap }}
      data-testid={dataTestId}
      isContentVisible={isContentVisible}
    >
      <EntityChainStackWrapper>
        {mainStack}
        {chainsPlacement === EntityChainStackChainsPlacement.Overlay && (
          <ChainStackWrapper>{chainsStack}</ChainStackWrapper>
        )}
      </EntityChainStackWrapper>
      {isContentVisible && (
        <TitleWithHint
          gap={spacing.infoContainerGap}
          titleVariant={content.titleVariant}
          title={capitalizeString(content.title)}
          hintVariant={content.descriptionVariant}
          hint={chainKeys.map(capitalizeString).join(' ')}
          hintOnHover={hintOnHover}
          titleDataTestId="entity-chain-stack-title"
          hintDataTestId="entity-chain-stack-chain-name"
        >
          {chainsPlacement === EntityChainStackChainsPlacement.Overlay
            ? null
            : chainsStack}
        </TitleWithHint>
      )}
    </EntityChainContainer>
  );
};
