import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LockOutlineRoundedIcon from '@mui/icons-material/LockOutlineRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from '@/components/Badge/Badge.styles';
import { ColumnTable } from '@/components/core/ColumnTable/ColumnTable';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { EntityStackWithBadge } from '../EntityStackWithBadge/EntityStackWithBadge';
import { PositionOverview } from './components/PositionOverview';
import { PositionOverviewButton } from './components/PositionOverviewButton';
import { COLUMN_SPACING, ICON_STYLES, TYPOGRAPHY_VARIANTS } from './constants';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledDetailsContainer,
  StyledOverviewActions,
  StyledOverviewColumn,
  StyledSectionContent,
  StyledSectionDivider,
  StyledSummaryContent,
  StyledTablesColumn,
  StyledTagsRow,
} from './PositionCard.styles';
import type { PositionCardProps, PositionGroup } from './types';
import { isChainPortfolioPosition } from './types';
import { useColumnDefinitions, usePositionGroups } from './hooks';
import { formatTimeDifference } from './utils';
import { RewardIcon } from '@/components/illustrations/RewardIcon';
import { TitleWithHint } from '@/components/composite/TitleWithHint/TitleWithHint';
import { useGetAddressExplorerUrl } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';
import { AppPaths } from '@/const/urls';
import type { DisplayableEntity } from '../EntityAvatar/types';
import { PositionCardSkeleton } from './components/PositionCardSkeleton';

export const PositionCard: FC<PositionCardProps> = ({
  positions,
  onSelect,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const getAddressExplorerUrl = useGetAddressExplorerUrl();

  const handleMainPositionClick = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleExpandedPositionClick = (group: PositionGroup) => {
    onSelect?.(group.position);
  };

  const handleAddressExplorerClick = (chainId: number, address: string) => {
    const url = getAddressExplorerUrl(chainId, address);
    if (!url) {
      return;
    }
    openInNewTab(url);
  };

  const handleInfoClick = (earn: string) => {
    router.push(`${AppPaths.Earn}/${earn}`);
  };

  const { supplyColumns, rewardColumns, borrowColumns } = useColumnDefinitions(
    TYPOGRAPHY_VARIANTS.title,
    TYPOGRAPHY_VARIANTS.description,
  );

  const positionGroups = usePositionGroups(
    positions,
    supplyColumns,
    borrowColumns,
    rewardColumns,
  );

  const firstPosition = positions?.[0];
  const totalNetUsd = positions?.reduce((sum, pos) => sum + pos.netUsd, 0) ?? 0;
  const hasRewards = positionGroups.some((group) =>
    group.sections.some((section) => section.type === 'rewards'),
  );

  if (isLoading || !firstPosition) {
    return <PositionCardSkeleton />;
  }

  // Create protocol entity for EntityStackWithBadge
  const protocolEntity: DisplayableEntity = firstPosition.protocol;

  // Create badge entities based on position type
  const badgeEntities: DisplayableEntity[] = isChainPortfolioPosition(
    firstPosition,
  )
    ? [firstPosition.chain]
    : [];

  return (
    <StyledAccordion
      data-testId="position-card"
      aria-label={`Position card for ${firstPosition.protocol.name} protocol`}
      expanded={isExpanded}
      disableGutters
    >
      <StyledAccordionSummary>
        <StyledSummaryContent onClick={() => handleMainPositionClick()}>
          <EntityStackWithBadge
            entities={[protocolEntity]}
            badgeEntities={badgeEntities}
            size={AvatarSize.XXL}
            content={{
              title: firstPosition.protocol.name,
              titleVariant: TYPOGRAPHY_VARIANTS.title,
              hintVariant: TYPOGRAPHY_VARIANTS.description,
            }}
            spacing={{
              badge: COLUMN_SPACING.badge,
            }}
          />
          <StyledTagsRow>
            <Badge
              variant={BadgeVariant.Secondary}
              size={BadgeSize.MD}
              label={firstPosition.type}
              data-testid={`earn-card-tag-${firstPosition.type.toLowerCase().replace(/\s+/g, '-')}`}
            />
            {hasRewards && (
              <Badge
                variant={BadgeVariant.Alpha}
                size={BadgeSize.MD}
                startIcon={<RewardIcon sx={ICON_STYLES} />}
              />
            )}
            <TitleWithHint
              title={t('format.currency', {
                value: totalNetUsd,
              })}
              titleVariant={TYPOGRAPHY_VARIANTS.title}
              sx={(theme) => ({
                textAlign: 'left',
                flex: '1 0 100%',
                [theme.breakpoints.up('md')]: {
                  textAlign: 'right',
                  flex: '0 0 auto',
                },
              })}
            />
          </StyledTagsRow>
        </StyledSummaryContent>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <StyledDetailsContainer>
          {positionGroups.map((positionGroup, index) => {
            const { position } = positionGroup;
            const earn = position.earn;
            const openedAt = position.openedAt;
            const unlockAt = position.unlockAt;
            const description = position.description;
            // Chain ID is only available for chain-based positions
            const chainId = isChainPortfolioPosition(position)
              ? position.chain.chainId
              : undefined;

            return (
              <Fragment key={position.address}>
                <StyledSectionDivider
                  sx={{ marginTop: index === 0 ? 1.5 : 0 }}
                />
                <StyledSectionContent>
                  <StyledOverviewColumn>
                    {!!openedAt && (
                      <PositionOverview
                        icon={<CalendarMonthRoundedIcon sx={ICON_STYLES} />}
                        header={t('portfolio.defiPositionCard.overview.opened')}
                        description={formatTimeDifference(
                          openedAt,
                          t,
                          'openedPeriod',
                        )}
                      />
                    )}
                    {!!unlockAt && (
                      <PositionOverview
                        icon={<LockOutlineRoundedIcon sx={ICON_STYLES} />}
                        header={t('portfolio.defiPositionCard.overview.lockup')}
                        description={formatTimeDifference(
                          unlockAt,
                          t,
                          'lockupPeriod',
                        )}
                      />
                    )}
                    {!!description && (
                      <PositionOverview
                        icon={<NotesRoundedIcon sx={ICON_STYLES} />}
                        header={t(
                          'portfolio.defiPositionCard.overview.details',
                        )}
                        description={description}
                      />
                    )}
                    <StyledOverviewActions>
                      {chainId !== undefined && (
                        <PositionOverviewButton
                          tooltip={t(
                            'portfolio.defiPositionCard.overview.tooltip.address',
                          )}
                          onClick={() =>
                            handleAddressExplorerClick(
                              chainId,
                              position.address,
                            )
                          }
                          slots={{
                            icon: CodeRoundedIcon,
                          }}
                        />
                      )}
                      {!!earn && (
                        <PositionOverviewButton
                          tooltip={t(
                            'portfolio.defiPositionCard.overview.tooltip.info',
                          )}
                          onClick={() => handleInfoClick(earn)}
                          slots={{
                            icon: InfoOutlineRoundedIcon,
                          }}
                        />
                      )}
                    </StyledOverviewActions>
                  </StyledOverviewColumn>

                  <StyledTablesColumn data-testId="position-card-entry">
                    {positionGroup.sections.map((section) => (
                      <ColumnTable
                        key={section.id}
                        columns={section.columns}
                        data={section.data}
                        spacing={3}
                        headerGap={1.25}
                        dataRowGap={2}
                        onRowClick={() =>
                          handleExpandedPositionClick(positionGroup)
                        }
                      />
                    ))}
                  </StyledTablesColumn>
                </StyledSectionContent>
              </Fragment>
            );
          })}
        </StyledDetailsContainer>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
