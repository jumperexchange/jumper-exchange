import { Link } from '@/components/Link/Link';
import type { SocialLink } from '@/components/Menus/MainMenu/hooks';

interface MenuItemContentSocialLinkProps {
  link: SocialLink;
}

export const MenuItemContentSocialLink = ({
  link,
}: MenuItemContentSocialLinkProps) => {
  return (
    <Link
      href={link.link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={link.onClick}
      role="link"
      aria-label={`${link.label} social link`}
    >
      {link.prefixIcon}
    </Link>
  );
};
