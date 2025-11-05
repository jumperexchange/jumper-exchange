import Typography, { TypographyProps } from '@mui/material/Typography';
import { StyledLabelContainer } from '../Select.styles';

export const SelectorLabel = ({
  label,
  labelVariant,
}: {
  label: string;
  labelVariant?: TypographyProps['variant'];
}) => {
  return (
    <StyledLabelContainer>
      <Typography variant={labelVariant || 'bodySmallStrong'}>
        {label}
      </Typography>
    </StyledLabelContainer>
  );
};
