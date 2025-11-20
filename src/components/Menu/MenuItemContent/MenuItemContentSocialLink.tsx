import { Link } from '@/components/Link';
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
      onClick={link.onClick}
      role="link"
      aria-label={`${link.label} social link`}
    >
      {link.prefixIcon}
    </Link>
  );
};
