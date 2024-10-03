import NextLink from 'next/link';
import type { PropsWithChildren } from 'react';

interface OptionalLinkProps {
  url?: string;
  alt?: string;
}

export const Link: React.FC<PropsWithChildren<OptionalLinkProps>> = (props) => {
  if (props.url) {
    return (
      <NextLink
        href={props.url}
        aria-label={props.alt}
        style={{ textDecoration: 'inherit' }}
      >
        {props.children}
      </NextLink>
    );
  } else {
    return props.children;
  }
};
