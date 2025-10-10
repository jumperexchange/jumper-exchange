import { FC } from 'react';
import { Link, LinkProps } from './Link';

interface ConditionalLinkProps extends Omit<LinkProps, 'href'> {
  href?: string;
  children: React.ReactNode;
}

export const ConditionalLink: FC<ConditionalLinkProps> = ({
  href,
  children,
  sx,
  ...rest
}) => {
  if (!href) {
    return <>{children}</>;
  }

  return (
    <Link
      href={href}
      sx={{ textDecoration: 'none', color: 'unset', ...(sx ?? {}) }}
      {...rest}
    >
      {children}
    </Link>
  );
};
