import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@mui/material/Link';

type LinkProps = NextLinkProps & MuiLinkProps;

export const Link = (props: LinkProps) => {
  return <MuiLink component={NextLink} {...props} />;
};
