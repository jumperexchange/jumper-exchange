'use client';

import { StyledInfoIcon, Tooltip } from './TooltipInfo.style';

export const TooltipInfo = ({
  title,
  size,
}: {
  title: string;
  size?: number;
}) => {
  return (
    <Tooltip title={title} placement="top" enterTouchDelay={0} arrow>
      <StyledInfoIcon size={size} />
    </Tooltip>
  );
};
