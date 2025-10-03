import Typography from '@mui/material/Typography';
import { StyledLabelContainer } from '../Select.styles';

export const SelectorLabel = ({ label }: { label: string }) => {
  return (
    <StyledLabelContainer>
      <Typography variant="bodySmallStrong">{label}</Typography>
    </StyledLabelContainer>
  );
};
