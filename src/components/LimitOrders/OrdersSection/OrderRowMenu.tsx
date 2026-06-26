'use client';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { OrderMenuItemContainer } from './OrdersSection.styles';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant, Size } from '@/components/core/buttons/types';
import type { LimitOrder } from './types';

interface OrderRowMenuProps {
  order: LimitOrder;
}

export const OrderRowMenu = ({ order }: OrderRowMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const isCancellable = order.status === 'active' || order.status === 'pending';

  return (
    <>
      <IconButton variant={Variant.AlphaDark} size={Size.SM} onClick={handleOpen}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        disableAutoFocusItem
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: (theme) => ({
              mt: 0.5,
              minWidth: 180,
              p: 1,
              border: getSurfaceBorder(theme, 'surface1'),
              boxShadow: theme.shadows[1],
              borderRadius: `${theme.shape.radius16}px`,
            }),
          },
          list: {
            sx: {
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            },
          },
        }}
      >
        <OrderMenuItemContainer onClick={handleClose}>
          <Typography
            variant="bodySmallStrong"
            component="a"
            href={`https://explorer.cow.fi/orders/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            View on explorer
          </Typography>
        </OrderMenuItemContainer>
        <OrderMenuItemContainer onClick={handleClose}>
          <Typography variant="bodySmallStrong">Modify limit</Typography>
        </OrderMenuItemContainer>
        {isCancellable && (
          <OrderMenuItemContainer onClick={handleClose}>
            <Typography variant="bodySmallStrong" color="error">
              Cancel order
            </Typography>
          </OrderMenuItemContainer>
        )}
      </Menu>
    </>
  );
};
