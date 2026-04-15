import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LockOutlineRoundedIcon from '@mui/icons-material/LockOutlineRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import type { FC } from 'react';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { ColumnTable } from 'src/components/core/ColumnTable/ColumnTable';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { DeFiPositionOverview } from './components/DeFiPositionOverview';
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
} from './DeFiPositionCard.styles';
import type {
  DeFiPositionCardProps,
  PositionGroup,
} from './DeFiPositionCard.types';
import { useColumnDefinitions, usePositionGroups } from './hooks';
import { formatTimeDifference } from './utils';
import { RewardIcon } from 'src/components/illustrations/RewardIcon';
import { DeFiPositionCardSkeleton } from './DeFiPositionCardSkeleton';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import InfoOutlineRoundedIcon from '@mui/icons-material/InfoOutlineRounded';
import { useGetAddressExplorerUrl } from '@/hooks/useBlockchainExplorerURL';
import { openInNewTab } from '@/utils/openInNewTab';
import { AppPaths } from '@/const/urls';
import { useRouter } from 'next/navigation';
import { DeFiPositionOverviewButton } from './components/DeFiPositionOverviewButton';
import { isChainDefiPosition } from '@/utils/positions/type-guards';

export const DeFiPositionCard: FC<DeFiPositionCardProps> = ({
  defiPositions,
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
    defiPositions,
    supplyColumns,
    borrowColumns,
    rewardColumns,
  );

  const firstPosition = defiPositions?.[0];
  const totalNetUsd =
    defiPositions?.reduce((sum, pos) => sum + pos.netUsd, 0) ?? 0;
  const hasRewards = positionGroups.some((group) =>
    group.sections.some((section) => section.type === 'rewards'),
  );

  if (isLoading || !firstPosition) {
    return <DeFiPositionCardSkeleton />;
  }

  return (
    <StyledAccordion expanded={isExpanded} disableGutters>
      <StyledAccordionSummary>
        <StyledSummaryContent onClick={() => handleMainPositionClick()}>
          <EntityChainStack
            variant={EntityChainStackVariant.Protocol}
            address={
              defiPositions.length === 1 ? firstPosition.address : undefined
            }
            protocol={firstPosition.protocol}
            protocolSize={AvatarSize.XXL}
            chains={
              isChainDefiPosition(firstPosition) ? [firstPosition.chain] : []
            }
            content={{
              title: firstPosition.protocol.name,
              titleVariant: TYPOGRAPHY_VARIANTS.title,
              descriptionVariant: TYPOGRAPHY_VARIANTS.description,
            }}
            spacing={COLUMN_SPACING}
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
            {/* {defiPosition.performance && (
              <Badge
                variant={
                  defiPosition.performance > 0
                    ? BadgeVariant.Success
                    : BadgeVariant.Error
                }
                startIcon={
                  defiPosition.performance > 0 ? (
                    <ArrowUpIcon sx={ICON_STYLES} />
                  ) : (
                    <ArrowDownIcon sx={ICON_STYLES} />
                  )
                }
                size={BadgeSize.MD}
                label={`$${toFixedFractionDigits(Math.abs(defiPosition.performance), 0, 2)}`}
              />
            )} */}
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
            const chainId = isChainDefiPosition(position)
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
                      <DeFiPositionOverview
                        icon={<CalendarMonthRoundedIcon sx={ICON_STYLES} />}
                        header={t('portfolio.defiPositionCard.overview.opened')}
                        description={formatTimeDifference(openedAt, t)}
                      />
                    )}
                    {!!unlockAt && (
                      <DeFiPositionOverview
                        icon={<LockOutlineRoundedIcon sx={ICON_STYLES} />}
                        header={t('portfolio.defiPositionCard.overview.lockup')}
                        description={formatTimeDifference(unlockAt, t)}
                      />
                    )}
                    {!!description && (
                      <DeFiPositionOverview
                        icon={<NotesRoundedIcon sx={ICON_STYLES} />}
                        header={t(
                          'portfolio.defiPositionCard.overview.details',
                        )}
                        description={description}
                      />
                    )}
                    <StyledOverviewActions>
                      {chainId !== undefined && (
                        <DeFiPositionOverviewButton
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
                        <DeFiPositionOverviewButton
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

                  <StyledTablesColumn>
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
