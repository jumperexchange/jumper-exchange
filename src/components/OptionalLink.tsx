import type { CSSObject } from '@mui/material';
import NextLink from 'next/link';
import type { PropsWithChildren } from 'react';

interface OptionalLinkProps {
  url?: string;
  alt?: string;
  styles?: CSSObject;
}

export const OptionalLink: React.FC<PropsWithChildren<OptionalLinkProps>> = (
  props,
) => {
  if (props.url) {
    return (
      <NextLink
        href={props.url}
        aria-label={props.alt}
        style={{
          textDecoration: 'inherit',
          ...(props.styles as React.CSSProperties),
        }}
      >
        {props.children}
      </NextLink>
    );
  } else {
    return props.children;
  }
};
