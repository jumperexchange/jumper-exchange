import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import { StyledLabelContainer } from '../Select.styles';

interface SelectorLabelProps {
  label: string;
  labelVariant?: TypographyProps['variant'];
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  /** @deprecated Use `startAdornment` instead. */
  icon?: React.ReactNode;
  size?: 'small' | 'medium';
}

export const SelectorLabel = ({
  label,
  labelVariant,
  startAdornment,
  endAdornment,
  icon,
  size = 'small',
}: SelectorLabelProps) => {
  const resolvedStartAdornment = startAdornment ?? icon;

  return (
    <StyledLabelContainer size={size}>
      {resolvedStartAdornment}
      <Typography variant={labelVariant || 'bodySmallStrong'} noWrap>
        {label}
      </Typography>
      {endAdornment}
    </StyledLabelContainer>
  );
};
