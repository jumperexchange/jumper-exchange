import { alpha, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TotalBalanceIconButtonProps {
  refetch: () => void;
  children: JSX.Element | JSX.Element[];
}

function TotalBalanceIconButton({
  refetch,
  children,
}: TotalBalanceIconButtonProps) {
  const { t } = useTranslation();

  return (
    <Tooltip
      placement="top"
      enterTouchDelay={0}
      arrow
      title={t('navbar.walletMenu.refreshBalances')}
    >
      <IconButton
        size="medium"
        aria-label="Refresh"
        sx={(theme) => ({
          marginRight: 1,
          '&:hover': {
            backgroundColor: alpha(theme.palette.text.primary, 0.08),
          },
        })}
        onClick={() => {
          refetch();
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}

export default TotalBalanceIconButton;
