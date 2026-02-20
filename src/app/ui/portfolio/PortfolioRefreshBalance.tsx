'use client';

import type { IconButtonProps } from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LightIconButton } from './PortfolioPage.styles';
import Box from '@mui/material/Box';
import { usePortfolioState } from '@/providers/PortfolioProvider/PortfolioContext';

const getProgressValue = (updatedAt: number | null, timeToUpdate: number) =>
  updatedAt
    ? Math.min(100, ((Date.now() - updatedAt) / timeToUpdate) * 100)
    : 0;

interface PortfolioRefreshBalanceProps extends IconButtonProps {
  timeToUpdate?: number;
}

const PortfolioRefreshBalance: FC<PortfolioRefreshBalanceProps> = ({
  timeToUpdate = 60000,
  ...other
}) => {
  const { t } = useTranslation();
  const portfolioState = usePortfolioState();
  const { updatedAt, isInitialLoading, isRefreshing, refresh } = portfolioState;

  const isLoading = isInitialLoading || isRefreshing;

  const iconSize = 24;

  const [value, setValue] = useState(() =>
    getProgressValue(updatedAt, timeToUpdate),
  );

  useEffect(() => {
    setValue(getProgressValue(updatedAt, timeToUpdate));
    const id = setInterval(() => {
      const time = getProgressValue(updatedAt, timeToUpdate);
      setValue(time);
      if (time >= 100) {
        clearInterval(id);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [timeToUpdate, updatedAt]);

  useEffect(() => {
    if (isLoading) {
      setValue(0);
    }
  }, [isLoading]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    refresh();
    other.onClick?.(event);
  };

  return (
    <LightIconButton onClick={handleClick} disabled={isLoading} {...other}>
      <Tooltip
        title={t('portfolio.overviewCard.refreshTooltip')}
        placement="top"
        enterTouchDelay={0}
        arrow
        sx={{
          zIndex: 25000,
        }}
        slotProps={{
          popper: { sx: { zIndex: 25000 } },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            position: 'relative',
            placeItems: 'center',
          }}
        >
          {isLoading ? (
            <>
              <CircularProgress
                variant="determinate"
                size={iconSize}
                value={100}
                sx={(theme) => ({
                  position: 'absolute',
                  color: (theme.vars || theme).palette.alpha300.main,
                })}
              />
              <CircularProgress
                variant={'indeterminate'}
                size={iconSize}
                value={value}
                sx={(theme) => ({
                  color: (theme.vars || theme).palette.text.primary,
                })}
              />
            </>
          ) : (
            <RefreshIcon sx={{ width: iconSize, height: iconSize }} />
          )}
        </Box>
      </Tooltip>
    </LightIconButton>
  );
};

export default memo(PortfolioRefreshBalance);
