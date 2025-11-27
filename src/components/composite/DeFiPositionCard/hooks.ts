import type { TypographyProps } from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDefinition } from 'src/components/core/ColumnTable/ColumnTable.types';
import { createEmptyColumn } from 'src/components/core/ColumnTable/utils';
import type { DefiPosition, DefiToken } from 'src/types/jumper-backend';
import {
  renderApyCell,
  renderBorrowedActions,
  renderEntityCell,
  renderPositionActions,
  renderRewardActions,
  renderValueCell,
} from './utils';
import { GRID_SIZES } from './constants';
import type { PositionGroup, Section } from './DeFiPositionCard.types';

export const useColumnDefinitions = (
  titleVariant: TypographyProps['variant'],
  descriptionVariant: TypographyProps['variant'],
  position?: DefiPosition,
) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const supplyColumns = useMemo<ColumnDefinition<DefiToken>[]>(
    () => [
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
        render: (_token, rowIndex) =>
          rowIndex === 0 && position
            ? renderApyCell({
                position,
                titleVariant,
              })
            : null,
        gridProps: { size: GRID_SIZES.apyColumn },
      },
      {
        id: 'actions',
        hideHeader: true,
        render: (_token, rowIndex) =>
          rowIndex === 0 && position
            ? renderPositionActions({
                position,
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
    [t, titleVariant, descriptionVariant, isMobile, position],
  );

  const borrowColumns = useMemo<ColumnDefinition<DefiToken>[]>(
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
      createEmptyColumn<DefiToken>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (_token, rowIndex) =>
          rowIndex === 0 && position
            ? renderBorrowedActions({
                position,
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
    [t, titleVariant, descriptionVariant, isMobile, position],
  );

  const rewardColumns = useMemo<ColumnDefinition<DefiToken>[]>(
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
      createEmptyColumn<DefiToken>('empty-column', {
        size: GRID_SIZES.apyColumn,
      }),
      {
        id: 'actions',
        hideHeader: true,
        render: (_token, rowIndex) =>
          rowIndex === 0 && position
            ? renderRewardActions({
                position,
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
    [t, titleVariant, descriptionVariant, isMobile, position],
  );

  return {
    supplyColumns,
    borrowColumns,
    rewardColumns,
  };
};

export const usePositionSections = (
  position: DefiPosition | undefined,
  supplyColumns: ColumnDefinition<DefiToken>[],
  borrowColumns: ColumnDefinition<DefiToken>[],
  rewardColumns: ColumnDefinition<DefiToken>[],
): Section[] => {
  return useMemo(() => {
    if (!position) {
      return [];
    }

    const sections: Section[] = [];

    if (position.supplyTokens && position.supplyTokens.length > 0) {
      sections.push({
        id: `${position.address}-supply`,
        type: 'supply',
        data: position.supplyTokens,
        columns: supplyColumns,
        showHeader: true,
      });
    }

    if (position.borrowTokens && position.borrowTokens.length > 0) {
      sections.push({
        id: `${position.address}-borrow`,
        type: 'borrow',
        data: position.borrowTokens,
        columns: borrowColumns,
        showHeader: true,
      });
    }

    if (position.rewardTokens && position.rewardTokens.length > 0) {
      sections.push({
        id: `${position.address}-rewards`,
        type: 'rewards',
        data: position.rewardTokens,
        columns: rewardColumns,
        showHeader: true,
      });
    }

    return sections;
  }, [position, supplyColumns, borrowColumns, rewardColumns]);
};

export const usePositionGroups = (
  positions: DefiPosition[] | undefined,
  supplyColumns: ColumnDefinition<DefiToken>[],
  borrowColumns: ColumnDefinition<DefiToken>[],
  rewardColumns: ColumnDefinition<DefiToken>[],
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
          data: position.supplyTokens,
          columns: supplyColumns,
          showHeader: true,
        });
      }

      if (position.borrowTokens && position.borrowTokens.length > 0) {
        sections.push({
          id: `${position.address}-borrow`,
          type: 'borrow',
          data: position.borrowTokens,
          columns: borrowColumns,
          showHeader: true,
        });
      }

      if (position.rewardTokens && position.rewardTokens.length > 0) {
        sections.push({
          id: `${position.address}-rewards`,
          type: 'rewards',
          data: position.rewardTokens,
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
