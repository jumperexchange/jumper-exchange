import { useTheme } from '@mui/material/styles';
import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from './BackgroundGradient.styled';

const BackgroundGradient = ({ children }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <BackgroundGradientContainer className="background-gradient background-gradient--main">
      <>
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
        {children}
      </>
    </BackgroundGradientContainer>
  );
};

export default BackgroundGradient;
