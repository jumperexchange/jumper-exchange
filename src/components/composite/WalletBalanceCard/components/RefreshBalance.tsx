import { IconButtonProps } from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LightIconButton } from '../WalletBalanceCard.styles';
import Box from '@mui/material/Box';

const getProgressValue = (updatedAt: number, timeToUpdate: number) =>
  updatedAt
    ? Math.min(100, ((Date.now() - updatedAt) / timeToUpdate) * 100)
    : 0;

const RefreshBalance: FC<
  {
    updatedAt: number;
    timeToUpdate: number;
    isLoading?: boolean;
  } & IconButtonProps
> = ({ updatedAt, timeToUpdate, isLoading, onClick, ...other }) => {
  const { t } = useTranslation();

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

  return (
    <LightIconButton onClick={onClick} disabled={isLoading} {...other}>
      <Tooltip
        title={t('navbar.walletMenu.totalBalanceRefresh')}
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
                size={20}
                value={100}
                sx={(theme) => ({
                  position: 'absolute',
                  color: (theme.vars || theme).palette.alpha300.main,
                })}
              />
              <CircularProgress
                variant={isLoading ? 'indeterminate' : 'determinate'}
                size={20}
                value={value}
                sx={(theme) => ({
                  opacity: value === 100 && !isLoading ? 0.5 : 1,
                  color: (theme.vars || theme).palette.text.primary,
                })}
              />
            </>
          ) : (
            <RefreshIcon sx={{ width: 20, height: 20 }} />
          )}
        </Box>
      </Tooltip>
    </LightIconButton>
  );
};

export default memo(RefreshBalance);
