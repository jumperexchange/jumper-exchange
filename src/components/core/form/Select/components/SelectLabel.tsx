import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import { StyledLabelContainer } from '../Select.styles';

interface SelectorLabelProps {
  label: string;
  labelVariant?: TypographyProps['variant'];
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
}

export const SelectorLabel = ({
  label,
  labelVariant,
  icon,
  size = 'small',
}: SelectorLabelProps) => {
  return (
    <StyledLabelContainer size={size}>
      {icon}
      <Typography variant={labelVariant || 'bodySmallStrong'}>
        {label}
      </Typography>
    </StyledLabelContainer>
  );
};
