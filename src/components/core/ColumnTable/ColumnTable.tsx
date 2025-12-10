import { FC } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ColumnTableProps } from './ColumnTable.types';

export const ColumnTable: FC<ColumnTableProps> = ({
  columns,
  data,
  spacing = 3,
  showHeader = true,
  headerGap = 1.25,
  dataRowGap = 2,
  headerVariant = 'bodyXXSmall',
  headerColor = 'textSecondary',
  sx,
  getRowKey,
  onRowClick,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Grid container spacing={spacing} sx={sx}>
      {columns.map((column) => {
        const gridProps = column.cellGridProps || column.gridProps || {};

        return (
          <Grid key={column.id} {...gridProps}>
            <Stack spacing={dataRowGap}>
              {data.map((row, rowIndex) => {
                const rowKey = getRowKey
                  ? getRowKey(row, rowIndex)
                  : `row-${rowIndex}`;
                const shouldShowHeader = showHeader && rowIndex === 0;
                const cellContent = column.render(row, rowIndex);

                if (isMobile && !cellContent) {
                  return null;
                }

                const headerSx = column.headerSx?.(rowIndex);
                const cellSx = column.cellSx?.(rowIndex);

                return (
                  <Stack
                    key={`${rowKey}-${column.id}`}
                    gap={headerGap}
                    useFlexGap
                    onClick={() => onRowClick?.(row, rowIndex)}
                  >
                    {shouldShowHeader &&
                      !column.hideHeader &&
                      column.header && (
                        <Box sx={headerSx}>
                          <Typography
                            variant={headerVariant}
                            color={headerColor}
                          >
                            {column.header}
                          </Typography>
                        </Box>
                      )}
                    <Box sx={cellSx}>{cellContent}</Box>
                  </Stack>
                );
              })}
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
};
