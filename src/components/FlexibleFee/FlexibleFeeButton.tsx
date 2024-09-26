import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { alpha, darken, Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ButtonPrimary, ButtonSecondary } from '../Button';

interface FlexibleFeeButtonProps {
  // route: RouteExtended;
  isLoading?: boolean;
  isSuccess?: boolean;
  isDisabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FlexibleFeeButton = ({
  // route,
  isLoading,
  isSuccess,
  isDisabled,
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
    <ButtonPrimary
      onClick={handleClick}
      disabled={isLoading || isSuccess || isDisabled}
      fullWidth
      sx={{
        marginTop: theme.spacing(2),
        backgroundColor: isSuccess
          ? '#D6FFE7' //theme.palette.success.main
          : isDisabled
            ? alpha(theme.palette.text.primary, 0.08)
            : theme.palette.primary.main,
        '&:hover': {
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          backgroundColor: isSuccess
            ? theme.palette.success.main
            : darken(theme.palette.primary.main, 0.16),
        },
      }}
    >
      <FlexibleFeeButtonContent
        isSuccess={isSuccess}
        isLoading={isLoading}
        isDisabled={isDisabled}
      />
    </ButtonPrimary>
  );
};

export default FlexibleFeeButton;

const FlexibleFeeButtonContent = ({
  isSuccess,
  isLoading,
  isDisabled,
}: {
  isSuccess?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
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
        <FavoriteIcon
          sx={{ color: !isDisabled ? theme.palette.white.main : null }}
        />
        <Typography
          variant="bodySmallStrong"
          sx={{
            marginLeft: theme.spacing(1),
            color: !isDisabled ? theme.palette.white.main : null,
          }}
        >
          Contribute
        </Typography>
      </>
    );
  }
};
