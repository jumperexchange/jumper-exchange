import { type CSSObject } from '@mui/material';
import type { PropsWithChildren } from 'react';
import {
  OptionalLinkContainer,
  OptionalLinkFallbackContainer,
} from './OptionalLink.style';

interface OptionalLinkProps {
  href?: string;
  ariaLabel?: string;
  sx?: CSSObject;
}

export const OptionalLink: React.FC<
  PropsWithChildren<OptionalLinkProps & { disabled: boolean }>
> = (props) => {
  if (props?.disabled) {
    return (
      <OptionalLinkFallbackContainer>
        {props.children}
      </OptionalLinkFallbackContainer>
    );
  } else if (props.href) {
    return (
      <OptionalLinkContainer
        href={props.href}
        aria-label={props.ariaLabel}
        style={{
          ...(props.sx as React.CSSProperties),
        }}
      >
        {props.children}
      </OptionalLinkContainer>
    );
  } else {
    return props.children;
  }
};
