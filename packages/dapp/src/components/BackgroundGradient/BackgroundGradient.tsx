import { useTheme } from '@mui/material/styles';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from './BackgroundGradient.style';

export const BackgroundGradient = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <BackgroundGradientContainer>
      <BackgroundGradientBottomLeft isDarkMode={isDarkMode} />
      <BackgroundGradientBottomRight isDarkMode={isDarkMode} />
      <BackgroundGradientTopCenter isDarkMode={isDarkMode} />
    </BackgroundGradientContainer>
  );
};
