import type { CSSObject } from '@mui/material';
import NextLink from 'next/link';
import type { PropsWithChildren } from 'react';

interface OptionalLinkProps {
  href?: string;
  ariaLabel?: string;
  sx?: CSSObject;
}

export const OptionalLink: React.FC<PropsWithChildren<OptionalLinkProps>> = (
  props,
) => {
  if (props.href) {
    return (
      <NextLink
        href={props.href}
        aria-label={props.ariaLabel}
        style={{
          textDecoration: 'inherit',
          ...(props.sx as React.CSSProperties),
        }}
      >
        {props.children}
      </NextLink>
    );
  } else {
    return props.children;
  }
};
