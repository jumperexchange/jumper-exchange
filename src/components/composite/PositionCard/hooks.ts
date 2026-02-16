import type { TypographyProps } from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDefinition } from '@/components/core/ColumnTable/ColumnTable.types';
import { createEmptyColumn } from '@/components/core/ColumnTable/utils';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import {
  createEnhancedBalance,
  renderApyCell,
  renderBorrowedActions,
  renderEntityCell,
  renderPositionActions,
  renderRewardActions,
  renderValueCell,
} from './utils';
import { GRID_SIZES } from './constants';
import type { EnhancedPositionBalance, PositionGroup, Section } from './types';

export const useColumnDefinitions = (
  titleVariant: TypographyProps['variant'],
  descriptionVariant: TypographyProps['variant'],
) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const supplyColumns = useMemo<ColumnDefinition<EnhancedPositionBalance>[]>(
    () => [
      {
        id: 'supplied',
        header: t('portfolio.defiPositionCard.header.supplied'),
        render: (item) =>
          renderEntityCell({
            item,
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
        render: (item) =>
          renderValueCell({
            item,
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
        render: (item, rowIndex) =>
          rowIndex === 0 && item
            ? renderApyCell({
                item,
                titleVariant,
              })
            : null,
        gridProps: { size: GRID_SIZES.apyColumn },
      },
      {
        id: 'actions',
        hideHeader: true,
        render: (item, rowIndex) =>
          rowIndex === 0 && item.earn
            ? renderPositionActions({
                item,
                t,
                isMobile,
              })
            : null,
        cellSx: (item, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
          }),
          ...(!item.earn &&
            isMobile && {
              display: 'none',
            }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ],
    [t, titleVariant, descriptionVariant, isMobile],
  );

  const borrowColumns = useMemo<ColumnDefinition<EnhancedPositionBalance>[]>(
    () => [
      {
        id: 'borrowed',
        header: t('portfolio.defiPositionCard.header.borrowed'),
        render: (item) =>
          renderEntityCell({
            item,
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
        render: (item) =>
          renderValueCell({
            item,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      createEmptyColumn<EnhancedPositionBalance>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (item, rowIndex) =>
          rowIndex === 0 && item.earn
            ? renderBorrowedActions({
                item,
                t,
                isMobile,
              })
            : null,
        cellSx: (item, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
            ...(!item.earn &&
              isMobile && {
                display: 'none',
              }),
          }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ],
    [t, titleVariant, descriptionVariant, isMobile],
  );

  const rewardColumns = useMemo<ColumnDefinition<EnhancedPositionBalance>[]>(
    () => [
      {
        id: 'rewards',
        header: t('portfolio.defiPositionCard.header.rewards'),
        render: (item) =>
          renderEntityCell({
            item,
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
        render: (item) =>
          renderValueCell({
            item,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      createEmptyColumn<EnhancedPositionBalance>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (item, rowIndex) =>
          rowIndex === 0 && item.earn
            ? renderRewardActions({
                item,
                t,
                isMobile,
              })
            : null,
        cellSx: (item, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
            ...(!item.earn &&
              isMobile && {
                display: 'none',
              }),
          }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ],
    [t, titleVariant, descriptionVariant, isMobile],
  );

  return {
    supplyColumns,
    borrowColumns,
    rewardColumns,
  };
};

export const usePositionGroups = (
  positions: PortfolioPosition[] | undefined,
  supplyColumns: ColumnDefinition<EnhancedPositionBalance>[],
  borrowColumns: ColumnDefinition<EnhancedPositionBalance>[],
  rewardColumns: ColumnDefinition<EnhancedPositionBalance>[],
): PositionGroup[] => {
  return useMemo(() => {
    if (!positions || positions.length === 0) {
      return [];
    }

    return positions.map((position) => {
      const sections: Section[] = [];

      if (position.supplyTokens && position.supplyTokens.length > 0) {
        sections.push({
          id: `${position.address}-supply`,
          type: 'supply',
          data: position.supplyTokens.map((balance) =>
            createEnhancedBalance(balance, position),
          ),
          columns: supplyColumns,
          showHeader: true,
        });
      }

      if (position.borrowTokens && position.borrowTokens.length > 0) {
        sections.push({
          id: `${position.address}-borrow`,
          type: 'borrow',
          data: position.borrowTokens.map((balance) =>
            createEnhancedBalance(balance, position),
          ),
          columns: borrowColumns,
          showHeader: true,
        });
      }

      if (position.rewardTokens && position.rewardTokens.length > 0) {
        sections.push({
          id: `${position.address}-rewards`,
          type: 'rewards',
          data: position.rewardTokens.map((balance) =>
            createEnhancedBalance(balance, position),
          ),
          columns: rewardColumns,
          showHeader: true,
        });
      }

      return {
        position,
        sections,
      };
    });
  }, [positions, supplyColumns, borrowColumns, rewardColumns]);
};
