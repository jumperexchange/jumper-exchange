'use client';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant, Size } from '@/components/core/buttons/types';
import type { LimitOrder } from './types';
import { Typography } from '@mui/material';

interface OrderRowMenuProps {
  order: LimitOrder;
  onCancel?: (order: LimitOrder) => void;
}

export const OrderRowMenu = ({ order, onCancel }: OrderRowMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleModify = () => {
    handleClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.(order);
  };

  const isCancellable = order.status === 'active' || order.status === 'pending';

  return (
    <>
      <IconButton variant={Variant.Default} size={Size.SM} onClick={handleOpen}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { minWidth: 160, mt: 0.5 },
          },
        }}
      >
        <MenuItem
          onClick={handleClose}
          component="a"
          href={`https://explorer.cow.fi/orders/${order.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography variant="bodySmallStrong">View on explorer</Typography>
        </MenuItem>
        <MenuItem onClick={handleModify}>
          <Typography variant="bodySmallStrong">Modify limit</Typography>
        </MenuItem>
        {isCancellable && (
          <MenuItem onClick={handleCancel} sx={{ color: 'error.main' }}>
            <Typography variant="bodySmallStrong">Cancel order</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
