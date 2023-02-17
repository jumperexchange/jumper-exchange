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
    <BackgroundGradientContainer className="background-gradient background-gradient--main">
      {/* <BackgroundGradients
        isDarkMode={isDarkMode}
        className="background-gradients"
      /> */}
      <BackgroundGradientBottomLeft
        isDarkMode={isDarkMode}
        className="background-gradient background-gradient--bottom-left"
      />
      <BackgroundGradientBottomRight
        isDarkMode={isDarkMode}
        className="background-gradient background-gradient--bottom-right"
      />
      <BackgroundGradientTopCenter
        isDarkMode={isDarkMode}
        className="background-gradient background-gradient--top-center"
      />
    </BackgroundGradientContainer>
  );
};
