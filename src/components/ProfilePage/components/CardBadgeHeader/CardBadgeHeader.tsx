import { FC } from 'react';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import {
  StyledInfoIcon,
  Tooltip,
} from 'src/components/TooltipInfo/TooltipInfo.style';

export interface CardBadgeHeaderProps {
  label: string;
  tooltip: string;
}

export const CardBadgeHeader: FC<CardBadgeHeaderProps> = ({
  label,
  tooltip,
}) => {
  return (
    <Badge
      label={label}
      variant={BadgeVariant.Alpha}
      size={BadgeSize.MD}
      endIcon={
        <Tooltip
          title={tooltip}
          sx={(theme) => ({
            cursor: 'help',
            color: theme.palette.text.primary,
          })}
          placement="top"
          enterTouchDelay={0}
          arrow
        >
          <StyledInfoIcon size={16} sx={{ marginLeft: 0 }} />
        </Tooltip>
      }
    />
  );
};
