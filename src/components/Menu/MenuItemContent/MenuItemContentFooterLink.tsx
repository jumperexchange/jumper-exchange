import { Link } from '@/components/Link';
import type { FooterLink } from '@/components/Menus/MainMenu/hooks';

interface MenuItemContentFooterLinkProps {
  link: FooterLink;
}

export const MenuItemContentFooterLink = ({
  link,
}: MenuItemContentFooterLinkProps) => {
  return (
    <Link
      href={link.link.url}
      onClick={link.onClick}
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
  );
};
