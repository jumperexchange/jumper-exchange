import { FC, PropsWithChildren, ReactNode } from 'react';
import {
  BaseAlertVariant,
  StyledBaseAlert,
  StyledBaseAlertDescription,
  StyledBaseAlertHeader,
  StyledBaseAlertTitle,
} from './BaseAlert.styles';

import InfoIcon from '@mui/icons-material/Info';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { SxProps, Theme } from '@mui/material/styles';

interface BaseAlertProps extends PropsWithChildren {
  title?: string;
  description?: string;
  headerAppend?: ReactNode;
  headerPrepend?: ReactNode;
  variant?: BaseAlertVariant;
  sx?: SxProps<Theme>;
}

export const BaseAlert: FC<BaseAlertProps> = ({
  title,
  variant = 'default',
  headerAppend,
  headerPrepend,
  description,
  children,
  sx,
}) => {
  const hasTitle = !!title;
  const hasDescription = !!description;

  const getHeaderAppend = () => {
    if (headerAppend) {
      return headerAppend;
    }

    switch (variant) {
      case 'warning': {
        return <WarningRoundedIcon sx={{ height: 24, width: 24 }} />;
      }
      case 'error': {
        return <ErrorRoundedIcon sx={{ height: 24, width: 24 }} />;
      }
      case 'info':
      case 'hint': {
        return (
          <InfoIcon
            sx={(theme) => ({
              height: 24,
              width: 24,
              color: (theme.vars || theme).palette.alphaLight700.main,
              ...theme.applyStyles('light', {
                color: (theme.vars || theme).palette.alphaDark700.main,
              }),
            })}
          />
        );
      }

      default: {
        return (
          <InfoIcon
            sx={{
              height: 24,
              width: 24,
            }}
          />
        );
      }
    }
  };

  return (
    <StyledBaseAlert variant={variant} sx={sx}>
      <StyledBaseAlertHeader
        sx={{
          alignItems: !hasTitle && hasDescription ? 'flex-start' : 'center',
        }}
      >
        {getHeaderAppend()}
        {hasTitle && <StyledBaseAlertTitle>{title}</StyledBaseAlertTitle>}
        {!hasTitle && hasDescription && (
          <StyledBaseAlertDescription sx={{ mt: '2px' }}>
            {description}
          </StyledBaseAlertDescription>
        )}
        {headerPrepend}
      </StyledBaseAlertHeader>
      {hasTitle && hasDescription && (
        <StyledBaseAlertDescription>{description}</StyledBaseAlertDescription>
      )}
      {children}
    </StyledBaseAlert>
  );
};
