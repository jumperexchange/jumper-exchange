'use client';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSurfaceBorder } from '@/theme/utils/getSurfaceBorder';
import { OrderMenuItemContainer } from './OrdersSection.styles';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Variant, Size } from '@/components/core/buttons/types';
import { useCancelOrderFlowStore } from '@/stores/limitOrderFlow/CancelOrderFlowStore';
import { useModifyOrderFlowStore } from '@/stores/limitOrderFlow/ModifyOrderFlowStore';
import { useRepeatOrderFlowStore } from '@/stores/limitOrderFlow/RepeatOrderFlowStore';
import { type LimitOrder as Order } from '@/types/jumper-backend';
import { isOrderExpired } from './utils';
import { ORDERS_COMPLETED_STATUS, ORDERS_ONGOING_STATUS } from './constants';
import { useUserTracking } from '@/hooks/userTracking';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useBlockchainExplorerURL } from '@/hooks/useBlockchainExplorerURL';

interface OrderRowMenuProps {
  order: Order;
}

export const OrderRowMenu = ({ order }: OrderRowMenuProps) => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  const openCancelModal = useCancelOrderFlowStore((state) => state.openModal);
  const openModifyModal = useModifyOrderFlowStore((state) => state.openModal);
  const openRepeatModal = useRepeatOrderFlowStore((state) => state.openModal);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const expired = isOrderExpired(order);
  const hasTxHash = order.chainId && order.txHash;
  const isEditable = ORDERS_ONGOING_STATUS.includes(order.status) && !expired;
  const isRepeatable =
    ORDERS_COMPLETED_STATUS.includes(order.status) || expired;

  const explorerLink = useBlockchainExplorerURL(
    order.chainId,
    order.txHash || '',
    'tx',
  );

  const handleModifyClick = () => {
    handleClose();
    openModifyModal(order);
    trackEvent({
      action: TrackingAction.OnModifyLimitOrderOpen,
      category: TrackingCategory.Widget,
      label: 'modify_limit_order_open',
      data: { [TrackingEventParameter.OrderId]: order.orderId },
    });
  };

  const handleCancelClick = () => {
    handleClose();
    openCancelModal(order);
    trackEvent({
      action: TrackingAction.OnCancelLimitOrderOpen,
      category: TrackingCategory.Widget,
      label: 'cancel_limit_order_open',
      data: { [TrackingEventParameter.OrderId]: order.orderId },
    });
  };

  const handleRepeatClick = () => {
    handleClose();
    openRepeatModal(order);
    trackEvent({
      action: TrackingAction.OnRepeatLimitOrderOpen,
      category: TrackingCategory.Widget,
      label: 'repeat_limit_order_open',
      data: { [TrackingEventParameter.OrderId]: order.orderId },
    });
  };

  return (
    <>
      <IconButton
        variant={Variant.AlphaDark}
        size={Size.SM}
        onClick={handleOpen}
      >
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
        {hasTxHash && (
          <OrderMenuItemContainer onClick={handleClose}>
            <Typography
              variant="bodySmallStrong"
              component="a"
              href={explorerLink}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              {t('limitOrders.table.actions.viewOnExplorer')}
            </Typography>
          </OrderMenuItemContainer>
        )}

        {isEditable && (
          <OrderMenuItemContainer onClick={handleModifyClick}>
            <Typography variant="bodySmallStrong">
              {t('limitOrders.table.actions.modifyLimit')}
            </Typography>
          </OrderMenuItemContainer>
        )}
        {isEditable && (
          <OrderMenuItemContainer onClick={handleCancelClick}>
            <Typography variant="bodySmallStrong" color="error">
              {t('limitOrders.table.actions.cancelOrder')}
            </Typography>
          </OrderMenuItemContainer>
        )}
        {isRepeatable && (
          <OrderMenuItemContainer onClick={handleRepeatClick}>
            <Typography variant="bodySmallStrong">
              {t('limitOrders.table.actions.repeatOrder')}
            </Typography>
          </OrderMenuItemContainer>
        )}
      </Menu>
    </>
  );
};
