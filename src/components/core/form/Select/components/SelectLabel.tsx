import Typography, { TypographyProps } from '@mui/material/Typography';
import { StyledLabelContainer } from '../Select.styles';

export const SelectorLabel = ({
  label,
  labelVariant,
  size = 'small',
}: {
  label: string;
  labelVariant?: TypographyProps['variant'];
  size?: 'small' | 'medium';
}) => {
  return (
    <StyledLabelContainer size={size}>
      <Typography variant={labelVariant || 'bodySmallStrong'}>
        {label}
      </Typography>
    </StyledLabelContainer>
  );
};
