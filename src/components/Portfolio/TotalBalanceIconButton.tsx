import { alpha, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TotalBalanceIconButtonProps {
  refetch?: () => void;
  disabled?: boolean;
  children: JSX.Element | JSX.Element[];
  tooltipText?: string;
}

function TotalBalanceIconButton({
  refetch,
  disabled = false,
  children,
  tooltipText,
}: TotalBalanceIconButtonProps) {
  const { t } = useTranslation();

  return (
    <Tooltip
      title={tooltipText}
      placement="top"
      enterTouchDelay={0}
      arrow
      sx={{
        zIndex: 25000,
      }}
      slotProps={{
        popper: { sx: { zIndex: 2000 } },
      }}
    >
      <span>
        <IconButton
          size="medium"
          aria-label="Refresh"
          disabled={disabled}
          sx={(theme) => ({
            marginRight: 1,
            '&:hover': {
              padding: 1,
              backgroundColor: alpha(theme.palette.text.primary, 0.08),
            },
          })}
          onClick={() => {
            refetch && refetch();
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default TotalBalanceIconButton;
