import { ChevronLeft, FirstPage } from '@mui/icons-material';
import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import React from 'react';

interface PaginationControlProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

interface PaginationControlsProps {
  onFirstPage: () => void;
  onPreviousPage: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

const PaginationControl = ({
  onClick,
  disabled = false,
  children,
}: PaginationControlProps) => (
  <Box
    component="span"
    onClick={disabled ? undefined : onClick}
    sx={[
      {
        pointerEvents: 'auto',
      },
      disabled
        ? {
            cursor: 'default',
          }
        : {
            cursor: 'pointer',
          },
      disabled
        ? {
            opacity: 0.5,
          }
        : {
            opacity: 1,
          },
      disabled
        ? {
            '&:hover': {
              opacity: 0.5,
            },
          }
        : {
            '&:hover': {
              opacity: 0.7,
            },
          },
    ]}
  >
    {children}
  </Box>
);

export const PaginationControls = ({
  onFirstPage,
  onPreviousPage,
  disabled = false,
  sx = {},
}: PaginationControlsProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <PaginationControl onClick={onFirstPage} disabled={disabled}>
        <FirstPage />
      </PaginationControl>
      <PaginationControl onClick={onPreviousPage} disabled={disabled}>
        <ChevronLeft />
      </PaginationControl>
    </Box>
  );
};
