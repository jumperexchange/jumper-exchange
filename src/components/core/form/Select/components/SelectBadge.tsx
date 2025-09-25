import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

export const SelectBadge = ({ label }: { label: string }) => {
  return (
    <Badge
      label={label}
      size={BadgeSize.SM}
      variant={BadgeVariant.Primary}
      sx={{ marginRight: 0.5, boxSizing: 'border-box' }}
    />
  );
};
