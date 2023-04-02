import { SpotButton as SpotButtonStyled } from './SpotButton.style';

export const SpotButton = ({ children, name }) => {
  return (
    <>
      <SpotButtonStyled>{children}</SpotButtonStyled>
      <p>{name}</p>
    </>
  );
};
