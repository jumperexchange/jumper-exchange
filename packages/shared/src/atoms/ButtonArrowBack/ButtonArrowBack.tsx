import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material';
import { getContrastAlphaColor } from '../../utils';
import { ButtonBackArrowWrapper } from './ButtonArrowBack.styled';

type ButtonBackArrowProps = {
  onClick?: () => void;
  style?: object;
};

export const ButtonBackArrow: React.FC<ButtonBackArrowProps> = ({
  onClick,
  style,
}) => {
  const theme = useTheme();

  return (
    <ButtonBackArrowWrapper
      size="medium"
      aria-label="settings"
      edge="start"
      sx={{
        ...style,
        '&:hover': {
          backgroundColor: getContrastAlphaColor(theme, '4%'),
        },
      }}
      onClick={() => {
        onClick();
      }}
    >
      <ArrowBackIcon />
    </ButtonBackArrowWrapper>
  );
};
