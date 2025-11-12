import ArrowDownIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LockOutlineRoundedIcon from '@mui/icons-material/LockOutlineRounded';
import { FC, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { ColumnTable } from 'src/components/core/ColumnTable/ColumnTable';
import { AvatarSize } from 'src/components/core/AvatarStack/AvatarStack.types';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import { formatLockupDuration } from 'src/utils/earn/utils';
import { EntityChainStack } from '../EntityChainStack/EntityChainStack';
import { EntityChainStackVariant } from '../EntityChainStack/EntityChainStack.types';
import { DeFiPositionOverview } from './components/DeFiPositionOverview';
import { COLUMN_SPACING, ICON_STYLES, TYPOGRAPHY_VARIANTS } from './constants';
import {
  StyledAccordion,
  StyledAccordionDetails,
  StyledAccordionSummary,
  StyledDetailsContainer,
  StyledOverviewColumn,
  StyledSectionContent,
  StyledSectionDivider,
  StyledSummaryContent,
  StyledTablesColumn,
  StyledTagsRow,
} from './DeFiPositionCard.styles';
import { DeFiPositionCardProps, PositionGroup } from './DeFiPositionCard.types';
import { useColumnDefinitions, usePositionGroups } from './hooks';
import { formatTimeDifference } from './utils';
import { RewardIcon } from 'src/components/illustrations/RewardIcon';
import { DeFiPositionCardSkeleton } from './DeFiPositionCardSkeleton';
import { TitleWithHint } from '../TitleWithHint/TitleWithHint';

export const DeFiPositionCard: FC<DeFiPositionCardProps> = ({
  defiPosition,
  onSelect,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleMainPositionClick = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleExpandedPositionClick = (group: PositionGroup) => {
    onSelect?.(group.position);
  };

  const { positionColumns, rewardColumns } = useColumnDefinitions(
    TYPOGRAPHY_VARIANTS.title,
    TYPOGRAPHY_VARIANTS.description,
  );

  const positionGroups = usePositionGroups(
    defiPosition?.relatedPositions ?? (defiPosition ? [defiPosition] : []),
    positionColumns,
    rewardColumns,
  );

  const hasRewards = positionGroups.some((group) =>
    group.sections.some((section) => section.type === 'rewards'),
  );

  if (isLoading || !defiPosition) {
    return <DeFiPositionCardSkeleton />;
  }

  return (
    <StyledAccordion expanded={isExpanded} disableGutters>
      <StyledAccordionSummary>
        <StyledSummaryContent onClick={() => handleMainPositionClick()}>
          <EntityChainStack
            variant={EntityChainStackVariant.Protocol}
            protocol={defiPosition.protocol}
            protocolSize={AvatarSize.XXL}
            chains={[defiPosition.asset.chain]}
            content={{
              title: defiPosition.name,
              titleVariant: TYPOGRAPHY_VARIANTS.title,
              descriptionVariant: TYPOGRAPHY_VARIANTS.description,
            }}
            spacing={COLUMN_SPACING}
          />
          <StyledTagsRow>
            {defiPosition.tags.map((tag) => (
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.MD}
                label={tag}
                key={tag}
                data-testid={`earn-card-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              />
            ))}
            {hasRewards && (
              <Badge
                variant={BadgeVariant.Alpha}
                size={BadgeSize.MD}
                startIcon={<RewardIcon sx={ICON_STYLES} />}
              />
            )}
            {defiPosition.performance && (
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
            )}
            <TitleWithHint
              title={t('format.currency', {
                value: defiPosition.totalPriceUSD,
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
          {positionGroups.map((group, index) => (
            <Fragment key={group.position.slug}>
              <StyledSectionDivider sx={{ marginTop: index === 0 ? 3 : 0 }} />
              <StyledSectionContent>
                <StyledOverviewColumn>
                  {!!group.position.openedAt && (
                    <DeFiPositionOverview
                      icon={<CalendarMonthRoundedIcon sx={ICON_STYLES} />}
                      header={t('portfolio.defiPositionCard.overview.opened')}
                      description={formatTimeDifference(
                        group.position.openedAt,
                        t,
                      )}
                    />
                  )}
                  {!!group.position.lockupMonths && (
                    <DeFiPositionOverview
                      icon={<LockOutlineRoundedIcon sx={ICON_STYLES} />}
                      header={t('portfolio.defiPositionCard.overview.lockup')}
                      // TODO: need to use here diff between when user deposited and the total lockup duration
                      description={formatLockupDuration(
                        group.position.lockupMonths,
                      )}
                    />
                  )}
                </StyledOverviewColumn>
                <StyledTablesColumn>
                  {group.sections.map((section) => (
                    <ColumnTable
                      key={section.id}
                      columns={section.columns}
                      data={section.data}
                      spacing={3}
                      headerGap={1.25}
                      dataRowGap={2}
                      onRowClick={() => handleExpandedPositionClick(group)}
                    />
                  ))}
                </StyledTablesColumn>
              </StyledSectionContent>
            </Fragment>
          ))}
        </StyledDetailsContainer>
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};
