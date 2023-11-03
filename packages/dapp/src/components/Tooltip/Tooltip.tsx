import { Tooltip as MUITooltip, PopperProps } from '@mui/material';
import { PropsWithChildren, ReactNode } from 'react';

interface TooltipProps {
  title?: string;
  children: ReactNode;
  popperProps?: Partial<PopperProps> | undefined;
  disableHoverListener?: boolean | undefined;
}

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({
  title,
  children,
  popperProps,
  disableHoverListener,
}: TooltipProps) => {
  return !!title ? (
    <MUITooltip
      title={title}
      PopperProps={popperProps}
      enterTouchDelay={0}
      disableHoverListener={disableHoverListener}
      arrow
    >
      {children}
    </MUITooltip>
  ) : (
    <>{children}</>
  );
};
