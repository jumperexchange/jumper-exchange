import type { IconButtonProps } from '@mui/material';
import { CircularProgress, IconButton, Tooltip } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularBox } from './CircularProgress.style';

const getProgressValue = (updatedAt: number, timeToUpdate: number) =>
  updatedAt
    ? Math.min(100, ((Date.now() - updatedAt) / timeToUpdate) * 100)
    : 0;

const getSecondsToUpdate = (updatedAt: number, timeToUpdate: number) =>
  Math.max(Math.round((timeToUpdate - (Date.now() - updatedAt)) / 1000), 0);

const RefreshIcon: React.FC<
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
    <IconButton onClick={onClick} disabled={isLoading} {...other}>
      <Tooltip
        title={t('navbar.walletMenu.totalBalanceRefresh')}
        placement="top"
        enterTouchDelay={0}
        componentsProps={{
          popper: { sx: { zIndex: 25000 } },
        }}
        arrow
        sx={{
          zIndex: 25000,
        }}
      >
        <CircularBox>
          <CircularProgress
            variant="determinate"
            size={24}
            value={100}
            sx={(theme) => ({
              position: 'absolute',
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.grey[300]
                  : theme.palette.grey[800],
            })}
          />
          <CircularProgress
            variant={isLoading ? 'indeterminate' : 'determinate'}
            size={24}
            value={value}
            sx={(theme) => ({
              opacity: value === 100 && !isLoading ? 0.5 : 1,
              color:
                theme.palette.mode === 'light'
                  ? theme.palette.primary.main
                  : theme.palette.primary.light,
            })}
          />
        </CircularBox>
      </Tooltip>
    </IconButton>
  );
};

export default memo(RefreshIcon);
