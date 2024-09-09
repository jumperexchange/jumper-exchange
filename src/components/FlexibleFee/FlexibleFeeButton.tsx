import CheckIcon from '@mui/icons-material/Check';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Typography, useTheme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { ButtonSecondary } from '../Button';
interface FlexibleFeeButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const FlexibleFeeButton = ({
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
          ? theme.palette.success.main
          : theme.palette.grey[100],
        '&:hover': {
          backgroundColor: isSuccess
            ? theme.palette.success.main
            : theme.palette.grey[300],
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
    return <CheckIcon />;
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
          {t('flexibleFee.contribute')}
        </Typography>
      </>
    );
  }
};
