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
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FlexibleFeeButton = ({
  // route,
  isLoading,
  isSuccess,
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
      disabled={isLoading || isSuccess}
      fullWidth
      sx={{
        marginTop: theme.spacing(2),
        backgroundColor: isSuccess
          ? '#D6FFE7' //theme.palette.success.main
          : alpha(theme.palette.text.primary, 0.08),
        '&:hover': {
          backgroundColor: isSuccess
            ? theme.palette.success.main
            : alpha(theme.palette.text.primary, 0.2),
        },
      }}
    >
      <FlexibleFeeButtonContent isSuccess={isSuccess} isLoading={isLoading} />
    </ButtonSecondary>
  );
};

export default FlexibleFeeButton;

const FlexibleFeeButtonContent = ({
  isSuccess,
  isLoading,
}: {
  isSuccess?: boolean;
  isLoading?: boolean;
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (isSuccess) {
    return <CheckIcon sx={{ color: '#00B849' }} />;
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
