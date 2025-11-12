import { TypographyProps } from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnDefinition } from 'src/components/core/ColumnTable/ColumnTable.types';
import { createEmptyColumn } from 'src/components/core/ColumnTable/utils';
import {
  EarnOpportunityRewardEntity,
  MinimalDeFiPosition,
} from 'src/types/defi';
import {
  renderApyCell,
  renderEntityCell,
  renderPositionActions,
  renderRewardActions,
  renderValueCell,
} from './utils';
import { GRID_SIZES } from './constants';
import { PositionGroup, Section } from './DeFiPositionCard.types';

export const useColumnDefinitions = (
  titleVariant: TypographyProps['variant'],
  descriptionVariant: TypographyProps['variant'],
) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const positionColumns = useMemo<ColumnDefinition<MinimalDeFiPosition>[]>(
    () => [
      {
        id: 'supplied',
        header: t('portfolio.defiPositionCard.header.supplied'),
        render: (position) =>
          renderEntityCell({
            item: position,
            titleVariant,
            descriptionVariant,
            t,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.entityColumn },
      },
      {
        id: 'value',
        header: t('portfolio.defiPositionCard.header.value'),
        render: (position) =>
          renderValueCell({
            item: position,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      {
        id: 'apy',
        header: t('portfolio.defiPositionCard.header.apy'),
        render: (position) =>
          renderApyCell({
            item: position,
            titleVariant,
            descriptionVariant,
            t,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.apyColumn },
      },
      {
        id: 'actions',
        hideHeader: true,
        render: (position, rowIndex) =>
          rowIndex === 0
            ? renderPositionActions({
                item: position,
                titleVariant,
                descriptionVariant,
                t,
                isMobile,
              })
            : null,
        cellSx: (rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
          }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ],
    [t, titleVariant, descriptionVariant, isMobile],
  );

  const rewardColumns = useMemo<
    ColumnDefinition<EarnOpportunityRewardEntity>[]
  >(
    () => [
      {
        id: 'rewards',
        header: t('portfolio.defiPositionCard.header.rewards'),
        render: (reward) =>
          renderEntityCell({
            item: reward,
            titleVariant,
            descriptionVariant,
            t,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.entityColumn },
      },
      {
        id: 'value',
        header: t('portfolio.defiPositionCard.header.value'),
        render: (reward) =>
          renderValueCell({
            item: reward,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      createEmptyColumn<EarnOpportunityRewardEntity>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (reward, rowIndex) =>
          rowIndex === 0
            ? renderRewardActions({
                item: reward,
                titleVariant,
                descriptionVariant,
                t,
                isMobile,
              })
            : null,
        cellSx: (rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
          }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ],
    [t, titleVariant, descriptionVariant, isMobile],
  );

  return {
    positionColumns,
    rewardColumns,
  };
};

export const usePositionGroups = (
  positions: MinimalDeFiPosition[] | undefined,
  positionColumns: ColumnDefinition<MinimalDeFiPosition>[],
  rewardColumns: ColumnDefinition<EarnOpportunityRewardEntity>[],
): PositionGroup[] => {
  return useMemo(() => {
    if (!positions) return [];

    return positions.map((position, index) => {
      const sections: Section[] = [
        {
          id: `${position.slug}-position`,
          type: 'position',
          data: [position],
          columns: positionColumns,
          showHeader: index === 0,
        },
      ];

      if (position.rewards && position.rewards.length > 0) {
        sections.push({
          id: `${position.slug}-rewards`,
          type: 'rewards',
          data: position.rewards,
          columns: rewardColumns,
          showHeader: true,
        });
      }

      return {
        position,
        sections,
      };
    });
  }, [positions, positionColumns, rewardColumns]);
};
