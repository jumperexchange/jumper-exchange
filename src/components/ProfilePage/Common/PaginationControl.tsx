import React from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box } from '@mui/material';
import { FirstPage, ChevronLeft } from '@mui/icons-material';

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
    sx={{
      cursor: disabled ? 'default' : 'pointer',
      pointerEvents: 'auto',
      opacity: disabled ? 0.5 : 1,
      '&:hover': { opacity: disabled ? 0.5 : 0.7 },
    }}
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
