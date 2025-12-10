import type { ComponentType } from 'react';

import { styled } from '@mui/material/styles';

import { Link, type LinkProps } from './Link';

const StyledExternalLink = styled(Link)(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  ...theme.typography.bodyMediumStrong,
  textDecoration: 'none',
  display: 'inline-flex',
  width: 'fit-content',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  transition: 'color 0.3s ease',
  '&:hover': {
    color: (theme.vars || theme).palette.primary.main,
  },
  '& svg': {
    width: 20,
    height: 20,
  },
})) as ComponentType<LinkProps>;

export const ExternalLink = (props: LinkProps) => (
  <StyledExternalLink
    target="_blank"
    rel="noopener noreferrer nofollow"
    {...props}
  />
);
