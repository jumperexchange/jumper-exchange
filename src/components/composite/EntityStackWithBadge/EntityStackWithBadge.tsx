import type { FC } from 'react';
import { useMemo } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { EntityStack } from '../EntityStack/EntityStack';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { TitleWithHints } from '@/components/composite/TitleWithHint/TitleWithHints';
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
  getEntityTokenChainId,
  isChain,
} from '../EntityAvatar/utils';
import { capitalizeString } from '@/utils/capitalizeString';
import { EntityStackWithBadgeSkeleton } from './EntityStackWithBadgeSkeleton';
import { mergeSx } from '@/utils/theme/mergeSx';

export const EntityStackWithBadge: FC<EntityStackWithBadgeProps> = ({
  entities,
  badgeEntities,
  placement = EntityStackBadgePlacement.Overlay,
  isLoading = false,
  isContentVisible = true,
  dataTestId,
  hintDataTestId = 'entity-stack-hint',
  addressOverride,
  entitiesSx,
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
  contentSx,
  containerSx,
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
      hintItemsDirection: 'row' as const,
      ...contentProp,
    }),
    [contentProp],
  );

  // Get chain IDs from badge entities (for explorer link override)
  const chainIds = useMemo(() => {
    if (!badgeEntities?.length) {
      return [];
    }
    return badgeEntities
      .map((e) => getEntityChainId(e))
      .filter((id): id is string => id !== undefined);
  }, [badgeEntities]);

  // Explorer link(s): one per unique address/chain pair.
  // addressOverride (e.g. an LP token address) is paired with every badge chain;
  // otherwise each entity's own address/chain is used, so multiple tokens across
  // different chains each get their own link.
  const explorerLinks = useMemo(() => {
    const overrideAddress = addressOverride?.trim();
    const pairs = overrideAddress
      ? chainIds.map((chainId) => ({ address: overrideAddress, chainId }))
      : entities
          .map((e) => ({
            address: getEntityAddress(e),
            chainId: getEntityTokenChainId(e),
          }))
          .filter(
            (pair): pair is { address: string; chainId: string } =>
              pair.address !== undefined && pair.chainId !== undefined,
          );

    const seen = new Set<string>();
    return pairs.filter(({ address, chainId }) => {
      const key = `${address}-${chainId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }, [addressOverride, chainIds, entities]);

  // Hint items: content.hintItems (explicit) > content.hint (plain string) >
  // one item per badge entity, each paired with its own explorer link (if any).
  const hintItems = useMemo(() => {
    if (content.hintItems) {
      return content.hintItems;
    }
    if (content.hint !== undefined) {
      return content.hint ? [{ key: 'hint', label: content.hint }] : [];
    }
    if (!badgeEntities?.length) {
      return [];
    }
    return badgeEntities.map((e, i) => {
      const badgeChainId = getEntityChainId(e);
      const label = isChain(e)
        ? (getChainById(e.chainId)?.name ?? capitalizeString(e.chainKey))
        : capitalizeString(getEntityName(e));
      const link = explorerLinks.find((l) => l.chainId === badgeChainId);
      return {
        key: badgeChainId ?? `badge-${i}`,
        label,
        hoverContent: link ? (
          <EntityExplorerLink
            address={link.address}
            chainId={link.chainId}
            hintVariant={content.hintVariant}
          />
        ) : undefined,
      };
    });
  }, [
    content.hintItems,
    content.hint,
    content.hintVariant,
    badgeEntities,
    explorerLinks,
    getChainById,
  ]);

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
      avatarSx={entitiesSx}
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
  const useMultipleHints = hintItems.length > 1;

  return (
    <EntityStackContainer
      sx={mergeSx({ gap: spacing.containerGap }, containerSx)}
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

      {isContentVisible &&
        (useMultipleHints ? (
          <TitleWithHints
            gap={spacing.infoContainerGap}
            titleVariant={content.titleVariant}
            title={capitalizeString(content.title ?? '')}
            hintVariant={content.hintVariant}
            hintItems={hintItems}
            hintItemsDirection={content.hintItemsDirection}
            titleDataTestId="entity-stack-title"
            hintDataTestId={hintDataTestId}
            sx={contentSx}
          >
            {!isOverlay ? badgeStack : null}
          </TitleWithHints>
        ) : (
          <TitleWithHint
            gap={spacing.infoContainerGap}
            titleVariant={content.titleVariant}
            title={capitalizeString(content.title ?? '')}
            hintVariant={content.hintVariant}
            hint={hintItems[0]?.label}
            hintOnHover={hintItems[0]?.hoverContent}
            titleDataTestId="entity-stack-title"
            hintDataTestId={hintDataTestId}
            sx={contentSx}
          >
            {!isOverlay ? badgeStack : null}
          </TitleWithHint>
        ))}
    </EntityStackContainer>
  );
};
