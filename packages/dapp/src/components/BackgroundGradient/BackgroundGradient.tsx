import {
  BackgroundGradientBottomLeft,
  BackgroundGradientBottomRight,
  BackgroundGradientContainer,
  BackgroundGradientTopCenter,
} from './BackgroundGradient.styled';

const BackgroundGradient = ({ children }) => {
  return (
    <BackgroundGradientContainer className="background-gradient background-gradient--main">
      <BackgroundGradientBottomLeft className="background-gradient background-gradient--bottom-left" />
      <BackgroundGradientBottomRight className="background-gradient background-gradient--bottom-right" />
      <BackgroundGradientTopCenter className="background-gradient background-gradient--top-center" />
      {children}
    </BackgroundGradientContainer>
  );
};

export default BackgroundGradient;
