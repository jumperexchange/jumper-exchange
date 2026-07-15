'use client';

import type { ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import type {
  ColumnDef,
  DataTableProps,
  MobileSection,
} from './DataTable.types';
import {
  DataTableContainer,
  DataTableDesktopRow,
  DataTableHeader,
  DataTableMobilePairRow,
  DataTableMobileRowContainer,
  DataTableMobileRowSection,
  DataTableRowCard,
  DataTableValueCell,
  TABLE_CELL_SX,
  TABLE_HEADER_CELL_SX,
} from './DataTable.styles';
import { mergeSx } from '@/utils/theme/mergeSx';

const DEFAULT_ROW_HEIGHT = 56;
const DEFAULT_SKELETON_COUNT = 4;

function FlexRowDesktop<T>({
  row,
  columns,
}: {
  row: T;
  columns: ColumnDef<T>[];
}) {
  const visible = columns.filter((c) => !c.hidden);
  return (
    <DataTableDesktopRow>
      {visible.map((col) => (
        <DataTableValueCell key={col.id} sx={col.cellSx}>
          {col.renderCell?.(row)}
        </DataTableValueCell>
      ))}
    </DataTableDesktopRow>
  );
}

function FlexRowMobile<T>({
  row,
  columns,
  sections,
}: {
  row: T;
  columns: ColumnDef<T>[];
  sections: MobileSection[];
}) {
  const colMap = Object.fromEntries(columns.map((c) => [c.id, c]));
  return (
    <DataTableMobileRowContainer>
      {sections.map((section, i) => (
        <DataTableMobileRowSection key={i} sx={section.sx}>
          <DataTableMobilePairRow>
            {section.columnIds.map((id) => {
              const col = colMap[id] as ColumnDef<T> | undefined;
              if (!col || col.hidden) {
                return null;
              }
              return (
                <DataTableValueCell key={id} sx={col.cellSx}>
                  {col.renderCell?.(row)}
                </DataTableValueCell>
              );
            })}
          </DataTableMobilePairRow>
        </DataTableMobileRowSection>
      ))}
    </DataTableMobileRowContainer>
  );
}

function FlexRow<T>({
  row,
  columns,
  sections,
  onClick,
}: {
  row: T;
  columns: ColumnDef<T>[];
  sections: MobileSection[];
  onClick?: (row: T) => void;
}) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isInteractive = Boolean(onClick);
  return (
    <DataTableRowCard
      isInteractive={isInteractive}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive ? 'button' : undefined}
      onClick={isInteractive ? () => onClick?.(row) : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.(row);
              }
            }
          : undefined
      }
    >
      {isMobile ? (
        <FlexRowMobile row={row} columns={columns} sections={sections} />
      ) : (
        <FlexRowDesktop row={row} columns={columns} />
      )}
    </DataTableRowCard>
  );
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  hasMobileView = true,
  sections = [],
  showHeader = false,
  stickyHeader = false,
  rowHeight = DEFAULT_ROW_HEIGHT,
  onRowClick,
  loading = false,
  skeletonCount = DEFAULT_SKELETON_COUNT,
  renderRow,
  renderSkeletonRow,
  testId,
  sx,
}: DataTableProps<T>): ReactNode {
  const visibleColumns = columns.filter((c) => !c.hidden);

  if (!hasMobileView) {
    const stickyHeaderCellSx = stickyHeader
      ? ({
          position: 'sticky' as const,
          top: 0,
          zIndex: 2,
          backgroundColor: 'surface2.main',
        } as const)
      : {};

    return (
      <Box sx={mergeSx(sx, { overflowX: 'auto', overflowY: 'visible' })}>
        <Table
          sx={{
            width: 'max-content',
            minWidth: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          {showHeader && (
            <TableHead>
              <TableRow>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={col.id}
                    aria-label={col.headerAriaLabel}
                    sx={{
                      ...TABLE_HEADER_CELL_SX,
                      ...stickyHeaderCellSx,
                      ...(col.width && {
                        width: col.width,
                        minWidth: col.width,
                      }),
                      ...(col.align && { textAlign: col.align }),
                      ...col.headerCellSx,
                    }}
                  >
                    {col.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {loading
              ? Array.from({ length: skeletonCount }, (_, i) => {
                  if (renderSkeletonRow) {
                    return renderSkeletonRow(i);
                  }
                  return (
                    <TableRow key={i}>
                      {visibleColumns.map((col) => (
                        <TableCell
                          key={col.id}
                          sx={{
                            ...TABLE_CELL_SX,
                            height: rowHeight,
                            ...(col.width && {
                              width: col.width,
                              minWidth: col.width,
                            }),
                            ...col.cellSx,
                          }}
                        >
                          {col.renderSkeleton ? (
                            col.renderSkeleton()
                          ) : (
                            <BaseSurfaceSkeleton
                              variant="rounded"
                              sx={{ height: 16, width: '60%' }}
                            />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              : rows.map((row, i) => {
                  const key = getRowKey(row);
                  if (renderRow) {
                    return renderRow(row, i);
                  }
                  return (
                    <TableRow
                      key={key}
                      sx={[
                        {
                          '&:last-child td, &:last-child th': {
                            borderBottom: 0,
                          },
                        },
                        Boolean(onRowClick) && { cursor: 'pointer' },
                      ]}
                      tabIndex={onRowClick ? 0 : undefined}
                      role={onRowClick ? 'button' : undefined}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      onKeyDown={
                        onRowClick
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onRowClick(row);
                              }
                            }
                          : undefined
                      }
                      data-testid={testId ? `${testId}-row-${key}` : undefined}
                    >
                      {visibleColumns.map((col) => (
                        <TableCell
                          key={col.id}
                          sx={{
                            ...TABLE_CELL_SX,
                            height: rowHeight,
                            ...(col.width && {
                              width: col.width,
                              minWidth: col.width,
                            }),
                            ...(col.align && { textAlign: col.align }),
                            ...col.cellSx,
                          }}
                        >
                          {col.renderCell?.(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </Box>
    );
  }

  return (
    <DataTableContainer>
      {showHeader && (
        <DataTableHeader>
          {visibleColumns.map((col) => (
            <DataTableValueCell key={col.id} sx={col.cellSx}>
              {col.header}
            </DataTableValueCell>
          ))}
        </DataTableHeader>
      )}
      {loading
        ? Array.from({ length: skeletonCount }, (_, i) => {
            if (renderSkeletonRow) {
              return renderSkeletonRow(i);
            }
            return (
              <DataTableRowCard key={i} isInteractive={false}>
                <DataTableDesktopRow>
                  {visibleColumns.map((col) => (
                    <DataTableValueCell key={col.id} sx={col.cellSx}>
                      {col.renderSkeleton ? (
                        col.renderSkeleton()
                      ) : (
                        <BaseSurfaceSkeleton
                          variant="rounded"
                          sx={{ height: 16, width: '60%' }}
                        />
                      )}
                    </DataTableValueCell>
                  ))}
                </DataTableDesktopRow>
              </DataTableRowCard>
            );
          })
        : rows.map((row, i) => {
            const key = getRowKey(row);
            if (renderRow) {
              return renderRow(row, i);
            }
            return (
              <FlexRow
                key={key}
                row={row}
                columns={columns}
                sections={sections}
                onClick={onRowClick}
              />
            );
          })}
    </DataTableContainer>
  );
}
