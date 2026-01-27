import type { TypographyProps } from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDefinition } from 'src/components/core/ColumnTable/ColumnTable.types';
import { createEmptyColumn } from 'src/components/core/ColumnTable/utils';
import type { DefiToken } from 'src/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';
import {
  createEnhancedToken,
  renderApyCell,
  renderBorrowedActions,
  renderEntityCell,
  renderPositionActions,
  renderRewardActions,
  renderValueCell,
} from './utils';
import { GRID_SIZES } from './constants';
import type {
  EnhancedDefiTokenWithPositionData,
  PositionGroup,
  Section,
} from './DeFiPositionCard.types';

export const useColumnDefinitions = (
  titleVariant: TypographyProps['variant'],
  descriptionVariant: TypographyProps['variant'],
) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const supplyColumns = useMemo<
    ColumnDefinition<EnhancedDefiTokenWithPositionData>[]
  >(() => {
    const columns: ColumnDefinition<EnhancedDefiTokenWithPositionData>[] = [
      {
        id: 'supplied',
        header: t('portfolio.defiPositionCard.header.supplied'),
        render: (token) =>
          renderEntityCell({
            item: token,
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
        render: (token) =>
          renderValueCell({
            item: token,
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
        render: (token, rowIndex) =>
          rowIndex === 0 && token
            ? renderApyCell({
                item: token,
                titleVariant,
              })
            : null,
        gridProps: { size: GRID_SIZES.apyColumn },
      },
      {
        id: 'actions',
        hideHeader: true,
        render: (token, rowIndex) =>
          rowIndex === 0 && token.earn
            ? renderPositionActions({
                item: token,
                t,
                isMobile,
              })
            : null,
        cellSx: (token, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
          }),
          ...(!token.earn &&
            isMobile && {
              display: 'none',
            }),
        }),
        gridProps: { size: GRID_SIZES.actionsColumn },
        align: 'end',
      },
    ];

    return columns;
  }, [t, titleVariant, descriptionVariant, isMobile]);

  const borrowColumns = useMemo<
    ColumnDefinition<EnhancedDefiTokenWithPositionData>[]
  >(
    () => [
      {
        id: 'borrowed',
        header: t('portfolio.defiPositionCard.header.borrowed'),
        render: (token) =>
          renderEntityCell({
            item: token,
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
        render: (token) =>
          renderValueCell({
            item: token,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      createEmptyColumn<EnhancedDefiTokenWithPositionData>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (token, rowIndex) =>
          rowIndex === 0 && token.earn
            ? renderBorrowedActions({
                item: token,
                t,
                isMobile,
              })
            : null,
        cellSx: (token, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
            ...(!token.earn &&
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

  const rewardColumns = useMemo<
    ColumnDefinition<EnhancedDefiTokenWithPositionData>[]
  >(
    () => [
      {
        id: 'rewards',
        header: t('portfolio.defiPositionCard.header.rewards'),
        render: (token) =>
          renderEntityCell({
            item: token,
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
        render: (token) =>
          renderValueCell({
            item: token,
            t,
            titleVariant,
            descriptionVariant,
            isMobile,
          }),
        gridProps: { size: GRID_SIZES.valueColumn },
      },
      createEmptyColumn<EnhancedDefiTokenWithPositionData>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (token, rowIndex) =>
          rowIndex === 0 && token.earn
            ? renderRewardActions({
                item: token,
                t,
                isMobile,
              })
            : null,
        cellSx: (token, rowIndex) => ({
          ...(rowIndex === 0 && {
            marginTop: {
              md: 3,
            },
            ...(!token.earn &&
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
  positions: DefiPosition[] | undefined,
  supplyColumns: ColumnDefinition<EnhancedDefiTokenWithPositionData>[],
  borrowColumns: ColumnDefinition<EnhancedDefiTokenWithPositionData>[],
  rewardColumns: ColumnDefinition<EnhancedDefiTokenWithPositionData>[],
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
          data: position.supplyTokens.map((token) =>
            createEnhancedToken(token, position),
          ),
          columns: supplyColumns,
          showHeader: true,
        });
      }

      if (position.borrowTokens && position.borrowTokens.length > 0) {
        sections.push({
          id: `${position.address}-borrow`,
          type: 'borrow',
          data: position.borrowTokens.map((token) =>
            createEnhancedToken(token, position),
          ),
          columns: borrowColumns,
          showHeader: true,
        });
      }

      if (position.rewardTokens && position.rewardTokens.length > 0) {
        sections.push({
          id: `${position.address}-rewards`,
          type: 'rewards',
          data: position.rewardTokens.map((token) =>
            createEnhancedToken(token, position),
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
