import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { alpha, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ButtonSecondary } from '../Button';

interface FlexibleFeeButtonProps {
  // route: RouteExtended;
  isLoading?: boolean;
  isSuccess?: boolean;
  isDissabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FlexibleFeeButton = ({
  // route,
  isLoading,
  isSuccess,
  isDissabled,
  onClick,
}: FlexibleFeeButtonProps) => {
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || isSuccess) {
      return;
    }
    onClick(event);
  };

  return (
    <ButtonSecondary
      onClick={handleClick}
      disabled={isLoading || isSuccess || isDissabled}
      fullWidth
      sx={{
        marginTop: theme.spacing(2),
        backgroundColor: isSuccess
          ? '#D6FFE7' //theme.palette.success.main
          : isDissabled
            ? alpha(theme.palette.text.primary, 0.08)
            : undefined,
        '&:hover': {
          cursor: isDissabled ? 'not-allowed' : undefined,
          backgroundColor: isSuccess ? theme.palette.success.main : undefined,
        },
      }}
    >
      <FlexibleFeeButtonContent
        isSuccess={isSuccess}
        isLoading={isLoading}
        isDissabled={isDissabled}
      />
    </ButtonSecondary>
  );
};

export default FlexibleFeeButton;

const FlexibleFeeButtonContent = ({
  isSuccess,
  isLoading,
  isDissabled,
}: {
  isSuccess?: boolean;
  isLoading?: boolean;
  isDissabled?: boolean;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (isSuccess) {
    return (
      <>
        <CheckIcon sx={{ color: '#00B849' }} />
        <Typography
          variant="bodySmallStrong"
          sx={{ marginLeft: theme.spacing(1), color: '#00B849' }}
        >
          Thanks
        </Typography>
      </>
    );
  }
  if (isLoading) {
    return (
      <CircularProgress size={24} sx={{ color: theme.palette.black.main }} />
    );
  } else {
    return (
      <>
        <FavoriteIcon />
        <Typography
          variant="bodySmallStrong"
          sx={{ marginLeft: theme.spacing(1) }}
        >
          Contribute
        </Typography>
      </>
    );
  }
};
