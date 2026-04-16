import type { FC } from 'react';
import { useMemo } from 'react';
import { EntityStack } from '../EntityStack/EntityStack';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { EntityExplorerLink } from '@/components/composite/EntityChainStack/components/EntityExplorerLink';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useChains } from '@/hooks/useChains';
import {
  EntityStackBadgePlacement,
  type EntityStackWithBadgeProps,
} from './types';
import {
  EntityStackContainer,
  EntityStackWrapper,
  BadgeStackWrapper,
  MainStackWrapper,
} from './EntityStackWithBadge.styles';
import {
  getEntityName,
  getEntityChainId,
  getEntityAddress,
  isChain,
} from '../EntityAvatar/utils';
import { capitalizeString } from '@/utils/capitalizeString';
import { EntityStackWithBadgeSkeleton } from './EntityStackWithBadgeSkeleton';

export const EntityStackWithBadge: FC<EntityStackWithBadgeProps> = ({
  entities,
  badgeEntities,
  placement = EntityStackBadgePlacement.Overlay,
  isLoading = false,
  isContentVisible = true,
  dataTestId,
  addressOverride,
  // Main stack props
  size,
  limit,
  direction = 'row-reverse',
  disableBorder = false,
  // Badge stack props
  badgeSize = AvatarSize.XS,
  badgeLimit,
  badgeDirection = 'row-reverse',
  // Spacing
  spacing: spacingProp = {},
  // Content
  content: contentProp = {},
}) => {
  const { getChainById } = useChains();

  // Merge spacing with defaults
  const spacing = useMemo(
    () => ({
      main: -1.5,
      badge: -1,
      containerGap: 2,
      infoContainerGap: 2,
      ...spacingProp,
    }),
    [spacingProp],
  );

  // Merge content with defaults
  const content = useMemo(
    () => ({
      title: '',
      titleVariant: 'titleXSmall' as const,
      hintVariant: 'bodyXSmall' as const,
      ...contentProp,
    }),
    [contentProp],
  );

  // Get addresses from main entities (for explorer link)
  const assetAddresses = useMemo(() => {
    return entities
      .map((e) => getEntityAddress(e))
      .filter((addr): addr is string => addr !== undefined);
  }, [entities]);

  // Get chain IDs from badge entities (for explorer link)
  const chainIds = useMemo(() => {
    if (!badgeEntities?.length) {
      return [];
    }
    return badgeEntities
      .map((e) => getEntityChainId(e))
      .filter((id): id is string => id !== undefined);
  }, [badgeEntities]);

  // Derive hint from badge entity names if not provided
  // For Chain entities, resolve proper name via useChains hook
  const hint = useMemo(() => {
    if (content.hint !== undefined) {
      return content.hint;
    }
    if (!badgeEntities?.length) {
      return '';
    }
    return badgeEntities
      .map((e) => {
        // For Chain entities, get proper name from useChains
        if (isChain(e)) {
          const extendedChain = getChainById(e.chainId);
          return extendedChain?.name ?? capitalizeString(e.chainKey);
        }
        return capitalizeString(getEntityName(e));
      })
      .join(' ');
  }, [content.hint, badgeEntities, getChainById]);

  // Show explorer link on hover when single chain + single address
  const hintOnHover = useMemo(() => {
    const resolvedAddress = addressOverride?.trim() || assetAddresses[0];
    if (resolvedAddress && chainIds.length === 1) {
      return (
        <EntityExplorerLink
          address={resolvedAddress}
          chainId={chainIds[0]}
          hintVariant={content.hintVariant}
        />
      );
    }
    return null;
  }, [addressOverride, assetAddresses, chainIds, content.hintVariant]);

  // Loading state
  if (isLoading) {
    return (
      <EntityStackWithBadgeSkeleton
        size={size}
        gap={spacing.containerGap}
        isContentVisible={isContentVisible}
      />
    );
  }

  const mainStack = (
    <EntityStack
      entities={entities}
      size={size}
      spacing={spacing.main}
      direction={direction}
      limit={limit}
      disableBorder={disableBorder}
    />
  );

  const badgeStack = badgeEntities?.length ? (
    <EntityStack
      entities={badgeEntities}
      size={badgeSize}
      spacing={spacing.badge}
      direction={badgeDirection}
      limit={badgeLimit}
    />
  ) : null;

  const isOverlay = placement === EntityStackBadgePlacement.Overlay;

  return (
    <EntityStackContainer
      sx={{ gap: spacing.containerGap }}
      data-testid={dataTestId}
      isContentVisible={isContentVisible}
    >
      <EntityStackWrapper>
        <MainStackWrapper
          hasOverlayMask={badgeEntities?.length === 1}
          badgeSize={badgeSize}
        >
          {mainStack}
        </MainStackWrapper>
        {isOverlay && badgeStack && (
          <BadgeStackWrapper badgeSize={badgeSize}>
            {badgeStack}
          </BadgeStackWrapper>
        )}
      </EntityStackWrapper>

      {isContentVisible && (
        <TitleWithHint
          gap={spacing.infoContainerGap}
          titleVariant={content.titleVariant}
          title={capitalizeString(content.title ?? '')}
          hintVariant={content.hintVariant}
          hint={hint}
          hintOnHover={hintOnHover}
          titleDataTestId="entity-stack-title"
          hintDataTestId="entity-stack-hint"
        >
          {!isOverlay ? badgeStack : null}
        </TitleWithHint>
      )}
    </EntityStackContainer>
  );
};
