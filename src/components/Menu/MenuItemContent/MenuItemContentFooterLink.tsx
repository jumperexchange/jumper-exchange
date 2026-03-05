import { Link } from '@/components/Link/Link';
import type { FooterLink } from '@/components/Menus/MainMenu/hooks';
import Typography from '@mui/material/Typography';

interface MenuItemContentFooterLinkProps {
  link: FooterLink;
  useDivider: boolean;
}

export const MenuItemContentFooterLink = ({
  link,
  useDivider,
}: MenuItemContentFooterLinkProps) => {
  return (
    <>
      <Link
        href={link.link.url}
        onClick={link.onClick}
        target={link.external ? '_blank' : undefined}
        rel={link.external ? 'noopener noreferrer' : undefined}
        role="link"
        aria-label={link.label}
        sx={(theme) => ({
          ...theme.typography.bodyXSmall,
          color: (theme.vars || theme).palette.alpha400.main,
          textDecoration: 'none',
          '&:hover': {
            color: 'text.secondary',
          },
        })}
      >
        {link.label}
      </Link>
      {useDivider && (
        <Typography
          variant="bodyXSmall"
          sx={(theme) => ({
            color: (theme.vars || theme).palette.alpha400.main,
          })}
        >
          •
        </Typography>
      )}
    </>
  );
};
