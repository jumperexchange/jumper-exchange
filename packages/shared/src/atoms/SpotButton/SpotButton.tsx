import Tooltip from '@mui/material/Tooltip';
import { SpotButton as SpotButtonStyled } from './SpotButton.style';

export const SpotButton = ({ children, tooltip, name }) => {
  return (
    <>
      <Tooltip title={tooltip}>
        <SpotButtonStyled>{children}</SpotButtonStyled>
      </Tooltip>
      <p>{name}</p>
    </>
  );
};
