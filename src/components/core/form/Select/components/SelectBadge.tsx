import { mergeSx } from '@/utils/theme/mergeSx';
import type { SxProps, Theme } from '@mui/material/styles';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

export const SelectBadge = ({
  label,
  sx,
}: {
  label: string;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Badge
      label={label}
      size={BadgeSize.SM}
      variant={BadgeVariant.Primary}
      sx={mergeSx({ marginRight: 0.5, boxSizing: 'border-box' }, sx)}
    />
  );
};
