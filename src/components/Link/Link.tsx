'use client';

import type { LinkProps as NextLinkProps } from 'next/link';
import NextLink from 'next/link';
import type { LinkProps as MuiLinkProps } from '@mui/material/Link';
import MuiLink from '@mui/material/Link';
import type { MouseEvent } from 'react';
import { useState } from 'react';

export type LinkProps = NextLinkProps & MuiLinkProps;

export const Link = (props: LinkProps) => {
  const [active, setActive] = useState(false);
  return (
    <MuiLink
      component={NextLink}
      {...props}
      prefetch={props.prefetch ?? (active ? null : false)}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
        if (!props.prefetch) {
          setActive(true);
        }
        props?.onMouseEnter?.(event);
      }}
    />
  );
};
